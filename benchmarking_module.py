import streamlit as st
import pandas as pd
import sqlite3
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots

DATABASE_NAME = 'corporate_emissions.sqlite'

def load_benchmark_data(query):
    """Connects to SQLite and executes a query for benchmark data."""
    conn = sqlite3.connect(DATABASE_NAME)
    df = pd.read_sql_query(query, conn)
    conn.close()
    return df

def get_company_benchmarking(company_id, reporting_period, scope_type):
    """Get benchmark comparison for a specific company, period and scope."""
    
    # First get the company's sector and industry
    conn = sqlite3.connect(DATABASE_NAME)
    company_info = pd.read_sql_query(
        f"SELECT sector, industry FROM Companies WHERE company_id = '{company_id}'", 
        conn
    )
    
    if company_info.empty:
        return None, None
    
    sector = company_info['sector'].iloc[0]
    industry = company_info['industry'].iloc[0]
    
    # Get the company's emissions for the specified scope and period
    company_emissions = pd.read_sql_query(f"""
        SELECT value, unit 
        FROM Emissions 
        WHERE company_id = '{company_id}' 
        AND reporting_period = '{reporting_period}' 
        AND scope_type = '{scope_type}'
    """, conn)
    
    if company_emissions.empty:
        conn.close()
        return None, None
    
    company_value = company_emissions['value'].iloc[0]
    unit = company_emissions['unit'].iloc[0]
    
    # Get industry benchmarks
    benchmarks = pd.read_sql_query(f"""
        SELECT median_value, p25_value, p75_value, best_in_class_value
        FROM IndustryBenchmarks
        WHERE industry = '{industry}' 
        AND year = '{reporting_period}'
        AND scope_type = '{scope_type}'
        AND scope_3_category IS NULL
    """, conn)
    
    # If no industry benchmarks, try sector benchmarks
    if benchmarks.empty:
        benchmarks = pd.read_sql_query(f"""
            SELECT median_value, p25_value, p75_value, best_in_class_value
            FROM IndustryBenchmarks
            WHERE sector = '{sector}' 
            AND year = '{reporting_period}'
            AND scope_type = '{scope_type}'
            AND scope_3_category IS NULL
        """, conn)
    
    conn.close()
    
    if benchmarks.empty:
        return company_value, None
    
    benchmark_data = {
        'company_value': company_value,
        'median': benchmarks['median_value'].iloc[0],
        'p25': benchmarks['p25_value'].iloc[0],
        'p75': benchmarks['p75_value'].iloc[0],
        'best_in_class': benchmarks['best_in_class_value'].iloc[0],
        'unit': unit
    }
    
    return company_value, benchmark_data

def get_intensity_comparison(company_id, reporting_period, scope_type):
    """Get emissions intensity comparison for a company."""
    conn = sqlite3.connect(DATABASE_NAME)
    
    # Get company info
    company_info = pd.read_sql_query(
        f"SELECT sector, industry FROM Companies WHERE company_id = '{company_id}'", 
        conn
    )
    
    if company_info.empty:
        conn.close()
        return None
    
    sector = company_info['sector'].iloc[0]
    industry = company_info['industry'].iloc[0]
    
    # Get company's intensity
    intensity = pd.read_sql_query(f"""
        SELECT employee_intensity, unit
        FROM EmissionsIntensity
        WHERE company_id = '{company_id}'
        AND reporting_period = '{reporting_period}'
        AND scope_type = '{scope_type}'
    """, conn)
    
    if intensity.empty:
        conn.close()
        return None
    
    company_intensity = intensity['employee_intensity'].iloc[0]
    intensity_unit = intensity['unit'].iloc[0]
    
    # Get industry averages
    industry_avg = pd.read_sql_query(f"""
        SELECT AVG(EI.employee_intensity) as avg_intensity
        FROM EmissionsIntensity EI
        JOIN Companies C ON EI.company_id = C.company_id
        WHERE C.industry = '{industry}'
        AND EI.reporting_period = '{reporting_period}'
        AND EI.scope_type = '{scope_type}'
        AND EI.employee_intensity IS NOT NULL
    """, conn)
    
    # Get sector averages
    sector_avg = pd.read_sql_query(f"""
        SELECT AVG(EI.employee_intensity) as avg_intensity
        FROM EmissionsIntensity EI
        JOIN Companies C ON EI.company_id = C.company_id
        WHERE C.sector = '{sector}'
        AND EI.reporting_period = '{reporting_period}'
        AND EI.scope_type = '{scope_type}'
        AND EI.employee_intensity IS NOT NULL
    """, conn)
    
    conn.close()
    
    industry_avg_val = industry_avg['avg_intensity'].iloc[0] if not industry_avg.empty and pd.notna(industry_avg['avg_intensity'].iloc[0]) else None
    sector_avg_val = sector_avg['avg_intensity'].iloc[0] if not sector_avg.empty and pd.notna(sector_avg['avg_intensity'].iloc[0]) else None
    
    intensity_data = {
        'company_intensity': company_intensity,
        'industry_avg': industry_avg_val,
        'sector_avg': sector_avg_val,
        'unit': intensity_unit
    }
    
    return intensity_data

def render_benchmarking_metrics(company_id, company_name, reporting_period):
    """Render benchmarking metrics for a company."""
    st.subheader(f"Benchmarking for {company_name} ({reporting_period})")
    
    # Format for each scope type
    scope_types = ['Scope 1', 'Scope 2', 'Scope 3 Total']
    
    col1, col2, col3 = st.columns(3)
    cols = [col1, col2, col3]
    
    for i, scope in enumerate(scope_types):
        company_value, benchmark_data = get_company_benchmarking(company_id, reporting_period, scope)
        if company_value is not None:
            with cols[i]:
                st.markdown(f"**{scope}**")
                if benchmark_data:
                    # Calculate percentile position (approximate)
                    if company_value <= benchmark_data['best_in_class']:
                        percentile = "Industry Leader (Best in Class)"
                        color = "green"
                    elif company_value <= benchmark_data['p25']:
                        percentile = "Top 25% (Leading)"
                        color = "lightgreen"
                    elif company_value <= benchmark_data['median']:
                        percentile = "Top 50% (Above Average)"
                        color = "orange"
                    elif company_value <= benchmark_data['p75']:
                        percentile = "Bottom 50% (Below Average)"
                        color = "orange"
                    else:
                        percentile = "Bottom 25% (Lagging)"
                        color = "red"
                    
                    st.metric(
                        label=f"Emissions ({benchmark_data['unit']})", 
                        value=f"{company_value:,.0f}",
                        delta=f"{((company_value - benchmark_data['median']) / benchmark_data['median'] * 100):,.1f}% vs. median"
                    )
                    
                    st.markdown(f"<div style='color:{color}; font-weight:bold;'>{percentile}</div>", unsafe_allow_html=True)
                    st.markdown(f"Industry Median: {benchmark_data['median']:,.0f} {benchmark_data['unit']}")
                    st.markdown(f"Top 25%: {benchmark_data['p25']:,.0f} {benchmark_data['unit']}")
                    st.markdown(f"Best in Class: {benchmark_data['best_in_class']:,.0f} {benchmark_data['unit']}")
                else:
                    st.metric(label=f"Emissions", value=f"{company_value:,.0f}")
                    st.markdown("*No industry benchmarks available for comparison*")
    
    # Intensity metrics
    st.subheader("Emissions Intensity Comparison")
    
    col1, col2, col3 = st.columns(3)
    cols = [col1, col2, col3]
    
    for i, scope in enumerate(scope_types):
        intensity_data = get_intensity_comparison(company_id, reporting_period, scope)
        if intensity_data and intensity_data['company_intensity'] is not None:
            with cols[i]:
                st.markdown(f"**{scope} Intensity**")
                if intensity_data['industry_avg'] is not None:
                    industry_diff = ((intensity_data['company_intensity'] - intensity_data['industry_avg']) / intensity_data['industry_avg'] * 100)
                    st.metric(
                        label=f"Per Employee ({intensity_data['unit']})",
                        value=f"{intensity_data['company_intensity']:.2f}",
                        delta=f"{industry_diff:.1f}% vs. industry avg",
                        delta_color="inverse"  # Lower is better for emissions
                    )
                    
                    # Add industry and sector context
                    if intensity_data['industry_avg'] is not None:
                        st.markdown(f"Industry Avg: {intensity_data['industry_avg']:.2f} {intensity_data['unit']}")
                    if intensity_data['sector_avg'] is not None:
                        st.markdown(f"Sector Avg: {intensity_data['sector_avg']:.2f} {intensity_data['unit']}")
                else:
                    st.metric(
                        label=f"Per Employee ({intensity_data['unit']})",
                        value=f"{intensity_data['company_intensity']:.2f}"
                    )
                    st.markdown("*No industry averages available for comparison*")

def plot_benchmarking_chart(company_id, company_name, reporting_periods, scope_type):
    """Create a plot comparing company to industry benchmarks over time."""
    
    # Get company data for multiple periods
    company_data = []
    benchmark_data = []
    
    for period in reporting_periods:
        company_val, benchmarks = get_company_benchmarking(company_id, period, scope_type)
        if company_val is not None and benchmarks is not None:
            company_data.append({'period': period, 'value': company_val})
            benchmark_data.append({
                'period': period, 
                'median': benchmarks['median'],
                'p25': benchmarks['p25'],
                'p75': benchmarks['p75'],
                'best': benchmarks['best_in_class'],
                'unit': benchmarks['unit']
            })
    
    if not company_data or not benchmark_data:
        return None
    
    # Create dataframes
    df_company = pd.DataFrame(company_data)
    df_benchmarks = pd.DataFrame(benchmark_data)
    
    # Create plot
    fig = go.Figure()
    
    # Add company line
    fig.add_trace(go.Scatter(
        x=df_company['period'],
        y=df_company['value'],
        mode='lines+markers',
        name=company_name,
        line=dict(color='#1f77b4', width=3),
        marker=dict(size=10)
    ))
    
    # Add benchmark lines
    fig.add_trace(go.Scatter(
        x=df_benchmarks['period'],
        y=df_benchmarks['median'],
        mode='lines',
        name='Industry Median',
        line=dict(color='#ff7f0e', width=2, dash='dash')
    ))
    
    fig.add_trace(go.Scatter(
        x=df_benchmarks['period'],
        y=df_benchmarks['p25'],
        mode='lines',
        name='Top 25%',
        line=dict(color='#2ca02c', width=2, dash='dot')
    ))
    
    fig.add_trace(go.Scatter(
        x=df_benchmarks['period'],
        y=df_benchmarks['best'],
        mode='lines',
        name='Best in Class',
        line=dict(color='#d62728', width=2, dash='dashdot')
    ))
    
    # Update layout
    unit = df_benchmarks['unit'].iloc[0] if not df_benchmarks.empty else 'mtCO2e'
    fig.update_layout(
        title=f"{scope_type} Emissions: {company_name} vs. Industry Benchmarks",
        xaxis_title="Reporting Period",
        yaxis_title=f"Emissions ({unit})",
        font=dict(size=14, color="#B0BEC5"),
        legend=dict(
            yanchor="top",
            y=0.99,
            xanchor="right",
            x=0.99
        ),
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)'
    )
    
    return fig

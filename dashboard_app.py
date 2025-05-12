import streamlit as st
import pandas as pd
import sqlite3
import plotly.express as px

DATABASE_NAME = 'corporate_emissions.sqlite'

@st.cache_data # Cache the data loading to improve performance
def load_data(query):
    """Connects to SQLite and executes a query, returning a DataFrame."""
    conn = sqlite3.connect(DATABASE_NAME)
    df = pd.read_sql_query(query, conn)
    conn.close()
    return df

# def get_distinct_values(table_name, column_name): # No longer needed due to sidebar removal
#     """Gets distinct values for a column from a table."""
#     query = f"SELECT DISTINCT {column_name} FROM {table_name} ORDER BY {column_name}"
#     df = load_data(query)
#     return ["All"] + df[column_name].tolist() # Add "All" option

# --- Page Configuration ---
st.set_page_config(
    page_title="Corporate Emissions Dashboard",
    page_icon="🌍",
    layout="wide",
    initial_sidebar_state="collapsed" # Collapse sidebar as it's not used for filters
)

# --- Custom CSS for larger fonts and improved layout ---
# Colors from color_palette.json (conceptual reference)
# background_deep_slate: "#2C3E50"
# text_primary_on_slate: "#FFFFFF"
# text_secondary_on_slate: "#B0BEC5"
# accent_scope1_cool_blue: "#5DADE2"
# accent_scope2_warm_orange: "#F39C12"
# accent_scope3_vibrant_purple": "#AF7AC5"
# neutral_dark_element_bg: "#34495E"
# neutral_light_border: "#566573"

st.markdown("""
<style>
    /* Base styles from config.toml will apply first */

    /* Ensure the main content area uses more screen width */
    .main .block-container {
        max-width: 90% !important; 
        padding-left: 2rem !important; 
        padding-right: 2rem !important;
    }

    /* Typography Scale & Weights */
    body, .stApp, .stMarkdown p, .stDataFrame, .stTable, .stSelectbox div[data-baseweb="select"] > div { /* Target selectbox text */
        font-family: 'sans serif'; /* Ensure consistency if not set in config.toml */
        font-size: 16px; 
        color: #FFFFFF; /* text_primary_on_slate */
    }
    h1 { /* Main Dashboard Title (st.title) */
        font-size: 36px; 
        font-weight: 700; /* Bold */
        text-align: center; 
        margin-bottom: 0.5rem; 
        color: #FFFFFF;
    }
    .stApp > header .stMarkdown p, .main > div:first-child > .stMarkdown p { /* Subtitle markdown */
        font-size: 18px;
        text-align: center; 
        margin-bottom: 1.5rem; 
        color: #B0BEC5; /* text_secondary_on_slate */
    }
    .stTabs [data-baseweb="tab"] div p { /* Tab labels */
        font-size: 20px; 
        font-weight: 600; /* Semi-bold */
    }
    /* Active tab styling to match primaryColor */
    .stTabs [data-baseweb="tab"][aria-selected="true"] {
        border-bottom-color: #5DADE2 !important; /* primaryColor */
    }
    .stTabs [data-baseweb="tab"][aria-selected="true"] div p {
        color: #5DADE2 !important; /* primaryColor */
    }

    h2 { /* Tab Headers (st.header) */
        font-size: 28px;
        font-weight: 700;
        margin-top: 1.5rem;
        margin-bottom: 1rem;
        color: #FFFFFF;
        border-bottom: 2px solid #566573; /* neutral_light_border */
        padding-bottom: 0.5rem;
    }
    h3 { /* Subheaders (st.subheader) */
        font-size: 22px;
        font-weight: 600;
        margin-top: 1.25rem;
        margin-bottom: 0.75rem;
        color: #FFFFFF;
    }
    
    /* KPI Metric Cards Styling */
    .stMetric {
        background-color: #34495E; /* neutral_dark_element_bg */
        border-radius: 8px;
        padding: 1.5rem; /* Consistent padding */
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* Drop shadow */
        border: 1px solid #566573; /* neutral_light_border */
    }
    .stMetric > div[data-testid="stMetricLabel"] > div > p { /* Metric Label */
        font-size: 18px; 
        font-weight: 500;
        color: #B0BEC5; /* text_secondary_on_slate */
        margin-bottom: 0.25rem;
    }
    .stMetric > div:nth-child(2) > div > p { /* Metric Value */
        font-size: 38px; 
        font-weight: 700; /* Bold */
        color: #FFFFFF; /* text_primary_on_slate */
        line-height: 1.2;
    }

    /* Dataframe/table headers and content */
    .stDataFrame th, .stTable th {
        font-size: 17px;
        font-weight: 600;
        background-color: #34495E; /* neutral_dark_element_bg */
    }
    .stDataFrame td, .stTable td {
        font-size: 16px;
    }
    .stDataFrame, .stTable {
        width: 100%; 
    }

    /* Button styling (for download buttons later) */
    .stButton>button {
        font-size: 16px;
        font-weight: 600;
        border-radius: 6px;
        padding: 0.5rem 1rem;
        background-color: #5DADE2; /* button_primary_bg from palette */
        color: #FFFFFF; /* button_primary_text from palette */
        border: none;
    }
    .stButton>button:hover {
        background-color: #4A90C2; /* Darker shade for hover, can be defined in palette too */
    }

</style>
""", unsafe_allow_html=True)


# --- Title ---
st.title("🌍 Corporate Emissions Dashboard") 
st.markdown("Explore Scope 1, 2, and 3 emissions data for various companies.") 

# --- Load ALL data initially ---
base_query = """
SELECT 
    E.reporting_period,
    C.company_name,
    C.country,
    C.sector,
    C.industry,
    E.scope_type,
    E.scope_3_category_detail,
    E.value,
    E.unit,
    C.employees -- Added employees for intensity calculations
FROM Emissions E
JOIN Companies C ON E.company_id = C.company_id
WHERE 1=1 
""" # Added C.employees
params = [] 

try:
    conn_main = sqlite3.connect(DATABASE_NAME)
    df_all_data = pd.read_sql_query(base_query, conn_main, params=tuple(params))
    conn_main.close()
    print(f"Shape of initial df_all_data: {df_all_data.shape}")

    # Convert reporting_period to string to handle mixed types and ensure consistent sorting/filtering
    if 'reporting_period' in df_all_data.columns:
        df_all_data['reporting_period'] = df_all_data['reporting_period'].astype(str)

except Exception as e:
    st.error(f"Error loading initial data: {e}")
    df_all_data = pd.DataFrame()


# --- Main Content Area (Tabs) ---
if not df_all_data.empty:
    tab1, tab2, tab3 = st.tabs(["📊 Overview", "🏢 Company Deep Dive", "🏭 Sector/Industry Analysis"])

    with tab1:
        st.header("Emissions Overview (All Data)")
        
        total_scope1 = df_all_data[df_all_data['scope_type'] == 'Scope 1']['value'].sum()
        total_scope2 = df_all_data[df_all_data['scope_type'] == 'Scope 2']['value'].sum()
        total_scope3_total = df_all_data[df_all_data['scope_type'] == 'Scope 3 Total']['value'].sum()

        col1, col2, col3 = st.columns(3)
        col1.metric("Total Scope 1 (mtCO2e)", f"{total_scope1:,.0f}")
        col2.metric("Total Scope 2 (mtCO2e)", f"{total_scope2:,.0f}")
        col3.metric("Total Scope 3 (mtCO2e)", f"{total_scope3_total:,.0f}")

        df_scope_agg = df_all_data[df_all_data['scope_type'].isin(['Scope 1', 'Scope 2', 'Scope 3 Total'])]
        df_scope_sum = df_scope_agg.groupby('scope_type')['value'].sum().reset_index()
        
        if not df_scope_sum.empty:
            scope_color_map = {'Scope 1': '#5DADE2', 'Scope 2': '#F39C12', 'Scope 3 Total': '#AF7AC5'}
            fig_scope_bar = px.bar(df_scope_sum, x='scope_type', y='value', title="Total Emissions by Scope",
                                   labels={'value': 'Total Emissions (mtCO2e)', 'scope_type': 'Scope Type'},
                                   color='scope_type', color_discrete_map=scope_color_map, height=500) 
            fig_scope_bar.update_layout(font=dict(size=14, color="#B0BEC5"), title_font_size=22, 
                                        xaxis_title_font_size=16, yaxis_title_font_size=16,
                                        legend_title_font_size=16, legend_font_size=14,
                                        xaxis=dict(tickfont=dict(size=12, color="#B0BEC5")), 
                                        yaxis=dict(tickfont=dict(size=12, color="#B0BEC5")),
                                        plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)')
            st.plotly_chart(fig_scope_bar, use_container_width=True)
        else:
            st.write("No data for 'Total Emissions by Scope' chart.")

    with tab2:
        st.header("Company Deep Dive")
        
        if not df_all_data.empty:
            all_company_names = ["Select a company..."] + sorted(df_all_data['company_name'].unique().tolist())
            selected_company_for_dive = st.selectbox("Select Company for Deep Dive", all_company_names, key="company_deep_dive_select")

            if selected_company_for_dive != "Select a company...":
                df_company_specific = df_all_data[df_all_data['company_name'] == selected_company_for_dive].copy() # Use .copy()
                
                st.subheader(f"Emissions for: {selected_company_for_dive}")

                company_last_5_years = []
                if not df_company_specific.empty:
                    # Ensure reporting_period is string for consistent sorting before taking unique
                    company_unique_years_series = sorted(df_company_specific['reporting_period'].astype(str).unique(), reverse=True)
                    company_last_5_years = company_unique_years_series[:5]
                    
                    if company_last_5_years:
                         st.caption(f"Displaying data for {selected_company_for_dive} for its latest available reporting periods: {', '.join(company_last_5_years)}")
                    else:
                        st.caption(f"No distinct reporting periods found for {selected_company_for_dive} to determine its last 5 years.")
                
                st.subheader(f"Annual Scope 1, 2, & 3 Total Emissions")
                df_company_annual_scopes = df_company_specific[
                    df_company_specific['scope_type'].isin(['Scope 1', 'Scope 2', 'Scope 3 Total'])
                ].copy()
                
                df_company_annual_scopes_filtered = pd.DataFrame()
                if company_last_5_years and not df_company_annual_scopes.empty:
                    df_company_annual_scopes_filtered = df_company_annual_scopes[df_company_annual_scopes['reporting_period'].isin(company_last_5_years)]
                
                if not df_company_annual_scopes_filtered.empty:
                    pivot_table_scopes = df_company_annual_scopes_filtered.pivot_table(
                        index='reporting_period', columns='scope_type', values='value', aggfunc='sum'
                    ).reset_index()

                    for scope_col in ['Scope 1', 'Scope 2', 'Scope 3 Total']:
                        if scope_col not in pivot_table_scopes.columns:
                            pivot_table_scopes[scope_col] = 0.0
                    
                    pivot_table_scopes = pivot_table_scopes.rename(columns={'reporting_period': 'Reporting Year'})
                    
                    units_info_list = []
                    for s_type in ['Scope 1', 'Scope 2', 'Scope 3 Total']:
                        unit_series = df_company_annual_scopes_filtered[df_company_annual_scopes_filtered['scope_type'] == s_type]['unit']
                        unit_val = unit_series.iloc[0] if not unit_series.empty and unit_series.first_valid_index() is not None else 'N/A'
                        units_info_list.append(f"{s_type} ({unit_val})")
                    st.caption(f"Units: {', '.join(units_info_list)}")

                    for col in ['Scope 1', 'Scope 2', 'Scope 3 Total']:
                        if col in pivot_table_scopes.columns:
                            pivot_table_scopes[col] = pd.to_numeric(pivot_table_scopes[col], errors='coerce').fillna(0).map('{:,.0f}'.format)
                    
                    st.dataframe(pivot_table_scopes[['Reporting Year', 'Scope 1', 'Scope 2', 'Scope 3 Total']].sort_values(by='Reporting Year', ascending=False), use_container_width=True)
                else:
                    st.write(f"No Scope 1, 2, or 3 Total emissions data for {selected_company_for_dive} in its last 5 reporting years.")

                st.subheader(f"Scope 3 Category Emissions")
                df_s3_categories_table = df_company_specific[
                    df_company_specific['scope_type'] == 'Scope 3 Category'
                ].copy()

                df_s3_categories_table_filtered = pd.DataFrame()
                if company_last_5_years and not df_s3_categories_table.empty:
                    df_s3_categories_table_filtered = df_s3_categories_table[df_s3_categories_table['reporting_period'].isin(company_last_5_years)]

                if not df_s3_categories_table_filtered.empty:
                    df_s3_display = df_s3_categories_table_filtered[[
                        'reporting_period', 'scope_3_category_detail', 'value', 'unit'
                    ]].rename(columns={
                        'reporting_period': 'Reporting Period', 
                        'scope_3_category_detail': 'Scope 3 Category',
                        'value': 'Emissions Value', 'unit': 'Unit'
                    })
                    df_s3_display['Emissions Value'] = pd.to_numeric(df_s3_display['Emissions Value'], errors='coerce').fillna(0).map('{:,.0f}'.format)
                    st.dataframe(df_s3_display.sort_values(by=['Reporting Period', 'Scope 3 Category'], ascending=[False, True]), use_container_width=True)
                else:
                    st.write(f"No Scope 3 Category data for {selected_company_for_dive} in its last 5 reporting years.")
            else:
                st.info("Select a company from the dropdown above to see its detailed emissions.")
        else:
            st.warning("No company data loaded.")

    with tab3:
        st.header("Sector/Industry Analysis (All Data)")
        if not df_all_data.empty:
            st.subheader("Total Emissions by Sector and Scope")
            df_sector_emissions = df_all_data[
                df_all_data['scope_type'].isin(['Scope 1', 'Scope 2', 'Scope 3 Total'])
            ].copy() 

            if not df_sector_emissions.empty:
                df_sector_sum = df_sector_emissions.groupby(['sector', 'scope_type'])['value'].sum().reset_index()
                df_pivot = df_sector_sum.pivot_table(index='sector', columns='scope_type', values='value', aggfunc='sum').reset_index()
                
                desired_cols = ['sector'] + [col for col in ['Scope 1', 'Scope 2', 'Scope 3 Total'] if col in df_pivot.columns]
                df_pivot = df_pivot[desired_cols].fillna(0)

                for col in ['Scope 1', 'Scope 2', 'Scope 3 Total']:
                    if col in df_pivot.columns:
                         df_pivot[col] = pd.to_numeric(df_pivot[col], errors='coerce').fillna(0).map('{:,.0f}'.format)
                st.dataframe(df_pivot.set_index('sector'), use_container_width=True)
            else:
                st.write("No Scope 1, 2, or 3 Total emissions data for sector table.")
            
            st.subheader("Average Emissions by Sector (Example Chart)")
            df_sector_avg_all = df_all_data[df_all_data['scope_type'].isin(['Scope 1', 'Scope 2', 'Scope 3 Total'])]
            df_sector_avg_all = df_sector_avg_all.groupby(['sector', 'scope_type'])['value'].mean().reset_index()
            if not df_sector_avg_all.empty:
                scope_color_map_sector = {'Scope 1': '#5DADE2', 'Scope 2': '#F39C12', 'Scope 3 Total': '#AF7AC5'}
                fig_sector_comp = px.bar(df_sector_avg_all, x='sector', y='value', color='scope_type', 
                                         barmode='group', title="Average Emissions by Sector and Scope (All Data)",
                                         labels={'value': 'Average Emissions (mtCO2e)', 'sector': 'Sector'},
                                         color_discrete_map=scope_color_map_sector, height=600) 
                fig_sector_comp.update_layout(font=dict(size=14, color="#B0BEC5"), title_font_size=22,
                                              xaxis_title_font_size=16, yaxis_title_font_size=16,
                                              legend_title_font_size=16, legend_font_size=14,
                                              xaxis=dict(tickfont=dict(size=12, color="#B0BEC5"), tickangle=45), 
                                              yaxis=dict(tickfont=dict(size=12, color="#B0BEC5")),
                                              margin=dict(b=120), plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)')
                st.plotly_chart(fig_sector_comp, use_container_width=True)
            else:
                st.write("No data for average sector comparison chart.")
        else:
            st.warning("No data loaded for sector/industry analysis.")
else:
    st.error("Failed to load initial data. Dashboard cannot be displayed.")

# To run this app:
# 1. Save as dashboard_app.py
# 2. Open your terminal in the project root directory
# 3. Make sure Streamlit is installed: pip3 install streamlit pandas plotly
# 4. Run: streamlit run dashboard_app.py

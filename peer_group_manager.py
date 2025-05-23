import streamlit as st
import pandas as pd
import sqlite3

DATABASE_NAME = 'corporate_emissions.sqlite'

def connect_db():
    """Connect to the SQLite database."""
    return sqlite3.connect(DATABASE_NAME)

def load_companies():
    """Load all companies from the database."""
    conn = connect_db()
    query = """
    SELECT company_id, company_name, sector, industry 
    FROM Companies 
    ORDER BY company_name
    """
    df = pd.read_sql_query(query, conn)
    conn.close()
    return df

def load_peer_groups():
    """Load all peer groups from the database."""
    conn = connect_db()
    query = """
    SELECT group_id, group_name, description, created_at
    FROM PeerGroups
    ORDER BY group_name
    """
    df = pd.read_sql_query(query, conn)
    conn.close()
    return df

def load_peer_group_companies(group_id):
    """Load companies in a specific peer group."""
    conn = connect_db()
    query = f"""
    SELECT C.company_id, C.company_name, C.sector, C.industry
    FROM Companies C
    JOIN PeerGroupCompanies PGC ON C.company_id = PGC.company_id
    WHERE PGC.group_id = {group_id}
    ORDER BY C.company_name
    """
    df = pd.read_sql_query(query, conn)
    conn.close()
    return df

def create_peer_group(name, description):
    """Create a new peer group."""
    conn = connect_db()
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
        INSERT INTO PeerGroups (group_name, description)
        VALUES (?, ?)
        """, (name, description))
        
        conn.commit()
        group_id = cursor.lastrowid
        conn.close()
        return group_id
    except Exception as e:
        conn.rollback()
        conn.close()
        raise e

def add_company_to_peer_group(group_id, company_id):
    """Add a company to a peer group."""
    conn = connect_db()
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
        INSERT INTO PeerGroupCompanies (group_id, company_id)
        VALUES (?, ?)
        """, (group_id, company_id))
        
        conn.commit()
        conn.close()
        return True
    except sqlite3.IntegrityError:
        # Company already in group
        conn.close()
        return False
    except Exception as e:
        conn.rollback()
        conn.close()
        raise e

def remove_company_from_peer_group(group_id, company_id):
    """Remove a company from a peer group."""
    conn = connect_db()
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
        DELETE FROM PeerGroupCompanies
        WHERE group_id = ? AND company_id = ?
        """, (group_id, company_id))
        
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        conn.rollback()
        conn.close()
        raise e

def delete_peer_group(group_id):
    """Delete a peer group and all its associations."""
    conn = connect_db()
    cursor = conn.cursor()
    
    try:
        # First delete from junction table
        cursor.execute("""
        DELETE FROM PeerGroupCompanies
        WHERE group_id = ?
        """, (group_id,))
        
        # Then delete the group
        cursor.execute("""
        DELETE FROM PeerGroups
        WHERE group_id = ?
        """, (group_id,))
        
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        conn.rollback()
        conn.close()
        raise e

def get_peer_group_metrics(group_id, reporting_period, scope_type):
    """Get emissions metrics for companies in a peer group."""
    conn = connect_db()
    
    query = f"""
    SELECT 
        C.company_name,
        E.value,
        E.unit
    FROM Emissions E
    JOIN Companies C ON E.company_id = C.company_id
    JOIN PeerGroupCompanies PGC ON C.company_id = PGC.company_id
    WHERE PGC.group_id = {group_id}
    AND E.reporting_period = '{reporting_period}'
    AND E.scope_type = '{scope_type}'
    ORDER BY E.value ASC
    """
    
    df = pd.read_sql_query(query, conn)
    conn.close()
    
    if df.empty:
        return None
    
    # Calculate metrics
    metrics = {
        'count': len(df),
        'min': df['value'].min(),
        'max': df['value'].max(),
        'median': df['value'].median(),
        'mean': df['value'].mean(),
        'unit': df['unit'].iloc[0] if not df['unit'].empty else 'mtCO2e',
        'companies': df
    }
    
    return metrics

def main():
    st.title("Peer Group Management")
    
    # Sidebar for navigation
    page = st.sidebar.radio("Select Page", ["View Peer Groups", "Create Peer Group", "Peer Group Analysis"])
    
    if page == "View Peer Groups":
        st.header("Existing Peer Groups")
        peer_groups = load_peer_groups()
        
        if peer_groups.empty:
            st.info("No peer groups have been created yet. Use the 'Create Peer Group' page to create one.")
        else:
            # Display all peer groups
            for _, group in peer_groups.iterrows():
                with st.expander(f"{group['group_name']} - {group['description']}"):
                    # Show companies in this group
                    group_companies = load_peer_group_companies(group['group_id'])
                    
                    if not group_companies.empty:
                        st.dataframe(
                            group_companies[['company_name', 'sector', 'industry']].rename(columns={
                                'company_name': 'Company',
                                'sector': 'Sector',
                                'industry': 'Industry'
                            })
                        )
                        
                        # Option to remove companies or delete the group
                        company_to_remove = st.selectbox(
                            "Select a company to remove",
                            group_companies['company_name'].tolist(),
                            key=f"remove_company_{group['group_id']}"
                        )
                        
                        if st.button("Remove Company", key=f"remove_btn_{group['group_id']}"):
                            company_id = group_companies[group_companies['company_name'] == company_to_remove]['company_id'].iloc[0]
                            if remove_company_from_peer_group(group['group_id'], company_id):
                                st.success(f"Removed {company_to_remove} from the peer group.")
                                st.experimental_rerun()
                    else:
                        st.info("This peer group has no companies.")
                    
                    # Delete group button
                    if st.button("Delete Peer Group", key=f"delete_group_{group['group_id']}"):
                        if delete_peer_group(group['group_id']):
                            st.success(f"Deleted peer group {group['group_name']}.")
                            st.experimental_rerun()
    
    elif page == "Create Peer Group":
        st.header("Create a New Peer Group")
        
        # Form for creating a new peer group
        with st.form("create_peer_group_form"):
            group_name = st.text_input("Group Name")
            group_description = st.text_area("Description")
            
            submitted = st.form_submit_button("Create Peer Group")
            
            if submitted and group_name:
                try:
                    group_id = create_peer_group(group_name, group_description)
                    st.success(f"Created peer group: {group_name}")
                except Exception as e:
                    st.error(f"Error creating peer group: {e}")
        
        # After a group is created, allow adding companies
        st.header("Add Companies to Peer Group")
        
        peer_groups = load_peer_groups()
        if not peer_groups.empty:
            selected_group = st.selectbox(
                "Select Peer Group",
                peer_groups['group_name'].tolist(),
                key="add_companies_group"
            )
            
            group_id = peer_groups[peer_groups['group_name'] == selected_group]['group_id'].iloc[0]
            
            # Show current companies in the group
            current_companies = load_peer_group_companies(group_id)
            if not current_companies.empty:
                st.subheader("Current Companies in Group")
                st.dataframe(
                    current_companies[['company_name', 'sector', 'industry']].rename(columns={
                        'company_name': 'Company',
                        'sector': 'Sector',
                        'industry': 'Industry'
                    })
                )
            
            # Add companies
            st.subheader("Add Companies")
            
            # Filter options
            all_companies = load_companies()
            
            # Don't show companies already in the group
            if not current_companies.empty:
                all_companies = all_companies[~all_companies['company_id'].isin(current_companies['company_id'])]
            
            # Sector filter
            sectors = ["All"] + sorted(all_companies['sector'].unique().tolist())
            selected_sector = st.selectbox("Filter by Sector", sectors, key="sector_filter")
            
            filtered_companies = all_companies
            if selected_sector != "All":
                filtered_companies = all_companies[all_companies['sector'] == selected_sector]
            
            # Industry filter (only show industries in the selected sector)
            industries = ["All"]
            if selected_sector != "All":
                industries += sorted(filtered_companies['industry'].unique().tolist())
                selected_industry = st.selectbox("Filter by Industry", industries, key="industry_filter")
                
                if selected_industry != "All":
                    filtered_companies = filtered_companies[filtered_companies['industry'] == selected_industry]
            
            # Company selection
            if not filtered_companies.empty:
                company_to_add = st.selectbox(
                    "Select Company to Add",
                    sorted(filtered_companies['company_name'].tolist()),
                    key="company_to_add"
                )
                
                if st.button("Add Company to Group"):
                    company_id = filtered_companies[filtered_companies['company_name'] == company_to_add]['company_id'].iloc[0]
                    
                    try:
                        if add_company_to_peer_group(group_id, company_id):
                            st.success(f"Added {company_to_add} to the peer group.")
                            st.experimental_rerun()
                        else:
                            st.warning(f"{company_to_add} is already in the peer group.")
                    except Exception as e:
                        st.error(f"Error adding company: {e}")
            else:
                st.info("No companies available with the selected filters.")
        else:
            st.info("No peer groups have been created yet. Create one using the form above.")
    
    elif page == "Peer Group Analysis":
        st.header("Peer Group Analysis")
        
        peer_groups = load_peer_groups()
        if peer_groups.empty:
            st.info("No peer groups have been created yet. Use the 'Create Peer Group' page to create one.")
        else:
            # Select peer group for analysis
            selected_group = st.selectbox(
                "Select Peer Group",
                peer_groups['group_name'].tolist(),
                key="analysis_group"
            )
            
            group_id = peer_groups[peer_groups['group_name'] == selected_group]['group_id'].iloc[0]
            
            # Show companies in this group
            group_companies = load_peer_group_companies(group_id)
            
            if group_companies.empty:
                st.warning(f"No companies in peer group: {selected_group}")
            else:
                st.subheader("Companies in Group")
                st.dataframe(
                    group_companies[['company_name', 'sector', 'industry']].rename(columns={
                        'company_name': 'Company',
                        'sector': 'Sector',
                        'industry': 'Industry'
                    })
                )
                
                # Get all reporting periods for these companies
                conn = connect_db()
                company_ids = ', '.join([f"'{id}'" for id in group_companies['company_id']])
                periods_query = f"""
                SELECT DISTINCT reporting_period
                FROM Emissions
                WHERE company_id IN ({company_ids})
                ORDER BY reporting_period DESC
                """
                periods_df = pd.read_sql_query(periods_query, conn)
                conn.close()
                
                if periods_df.empty:
                    st.warning(f"No emissions data found for companies in {selected_group}")
                else:
                    # Analysis options
                    col1, col2 = st.columns(2)
                    
                    with col1:
                        selected_period = st.selectbox(
                            "Select Reporting Period",
                            periods_df['reporting_period'].tolist(),
                            key="analysis_period"
                        )
                    
                    with col2:
                        selected_scope = st.selectbox(
                            "Select Scope",
                            ["Scope 1", "Scope 2", "Scope 3 Total"],
                            key="analysis_scope"
                        )
                    
                    # Get metrics for this peer group
                    metrics = get_peer_group_metrics(group_id, selected_period, selected_scope)
                    
                    if metrics:
                        # Display summary metrics
                        col1, col2, col3, col4 = st.columns(4)
                        
                        col1.metric("Companies Reporting", metrics['count'])
                        col2.metric(f"Median ({metrics['unit']})", f"{metrics['median']:,.0f}")
                        col3.metric(f"Mean ({metrics['unit']})", f"{metrics['mean']:,.0f}")
                        col4.metric(f"Range ({metrics['unit']})", f"{metrics['min']:,.0f} - {metrics['max']:,.0f}")
                        
                        # Display company ranking
                        st.subheader("Company Ranking")
                        
                        # Format values for display
                        metrics['companies']['value'] = metrics['companies']['value'].map('{:,.0f}'.format)
                        
                        st.dataframe(
                            metrics['companies'].rename(columns={
                                'company_name': 'Company',
                                'value': f'Emissions ({metrics["unit"]})',
                                'unit': 'Unit'
                            }).drop(columns=['unit']),
                            use_container_width=True
                        )
                        
                        # Create bar chart
                        import plotly.express as px
                        
                        # Use original metrics dataframe for the chart
                        chart_df = metrics['companies'].copy()
                        chart_df['value'] = pd.to_numeric(chart_df['value'].str.replace(',', ''))
                        
                        fig = px.bar(
                            chart_df,
                            x='company_name',
                            y='value',
                            title=f"{selected_scope} Emissions for {selected_group} ({selected_period})",
                            labels={
                                'company_name': 'Company',
                                'value': f'Emissions ({metrics["unit"]})'
                            },
                            height=500
                        )
                        
                        # Add median line
                        fig.add_hline(
                            y=metrics['median'],
                            line_dash="dash",
                            line_color="red",
                            annotation_text="Median",
                            annotation_position="top right"
                        )
                        
                        # Update layout
                        fig.update_layout(
                            xaxis_tickangle=45,
                            plot_bgcolor='rgba(0,0,0,0)',
                            paper_bgcolor='rgba(0,0,0,0)',
                            font=dict(size=14, color="#B0BEC5")
                        )
                        
                        st.plotly_chart(fig, use_container_width=True)
                    else:
                        st.warning(f"No data found for {selected_scope} in period {selected_period}")

if __name__ == "__main__":
    main()

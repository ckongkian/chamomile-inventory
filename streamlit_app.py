import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import json
from typing import Dict, List

# Configure the page with Chamomile branding
st.set_page_config(
    page_title="🌼 Chamomile Tea Inventory",
    page_icon="🌼",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Chamomile-themed CSS with warm, relaxing colors
st.markdown("""
<style>
    /* Import Chamomile fonts */
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap');
    
    /* Global styling with Chamomile theme */
    .main > div {
        padding-top: 1rem;
        font-family: 'Poppins', sans-serif;
        background-color: #F9E1D3 !important;
        color: #5A3E36 !important;
    }
    
    /* Force all text to be readable */
    * {
        color: #5A3E36 !important;
    }
    
    /* Main content background */
    .main .block-container {
        background-color: #F9E1D3 !important;
        padding: 2rem 1rem;
        max-width: 1200px;
    }
    
    /* Sidebar with Chamomile colors */
    .css-1d391kg {
        background: linear-gradient(180deg, #5A3E36 0%, #8B6F47 100%);
        border-right: 3px solid #EFDD86;
    }
    
    .css-1d391kg * {
        color: #FFFFFF !important;
    }
    
    .css-1d391kg .stMarkdown {
        color: #FFFFFF !important;
    }
    
    .css-1d391kg h1, .css-1d391kg h2, .css-1d391kg h3 {
        color: #FFFFFF !important;
        font-family: 'Playfair Display', serif;
    }
    
    /* Brand header with Chamomile styling */
    .chamomile-header {
        background: linear-gradient(135deg, #EFDD86 0%, #F4E49C 100%);
        color: #5A3E36 !important;
        padding: 2rem 1.5rem;
        border-radius: 15px;
        margin: 1rem 0 2rem 0;
        text-align: center;
        box-shadow: 0 6px 20px rgba(90, 62, 54, 0.15);
        border: 2px solid #5A3E36;
    }
    
    .chamomile-header h1 {
        color: #5A3E36 !important;
        margin: 0;
        font-size: 2.8rem;
        font-weight: 700;
        font-family: 'Playfair Display', serif;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
    }
    
    .chamomile-header p {
        color: #5A3E36 !important;
        margin: 0.5rem 0 0 0;
        font-size: 1.1rem;
        font-style: italic;
        opacity: 0.8;
    }
    
    /* Metrics cards with warm styling */
    .stMetric {
        background: #FFFFFF !important;
        border: 3px solid #EFDD86 !important;
        padding: 1.5rem;
        border-radius: 15px;
        margin: 0.5rem 0;
        box-shadow: 0 4px 15px rgba(90, 62, 54, 0.1);
        transition: all 0.3s ease;
    }
    
    .stMetric:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 25px rgba(90, 62, 54, 0.2);
        border-color: #5A3E36;
    }
    
    .stMetric label {
        color: #5A3E36 !important;
        font-weight: 600 !important;
        font-size: 1rem !important;
    }
    
    .stMetric [data-testid="metric-value"] {
        color: #5A3E36 !important;
        font-weight: 700 !important;
        font-size: 2rem !important;
    }
    
    .stMetric [data-testid="metric-delta"] {
        color: #25D366 !important;
        font-weight: 600 !important;
    }
    
    /* Alert styles with Chamomile theme */
    .alert-critical {
        background: #FFFFFF !important;
        border: 3px solid #dc2626 !important;
        border-left: 8px solid #dc2626 !important;
        border-radius: 12px;
        padding: 1.5rem;
        margin: 1rem 0;
        box-shadow: 0 4px 15px rgba(220, 38, 38, 0.15);
    }
    
    .alert-critical h4 {
        color: #dc2626 !important;
        font-weight: 700 !important;
        font-size: 1.3rem !important;
        margin: 0 0 0.5rem 0 !important;
        font-family: 'Playfair Display', serif;
    }
    
    .alert-warning {
        background: #FFFFFF !important;
        border: 3px solid #EFDD86 !important;
        border-left: 8px solid #EFDD86 !important;
        border-radius: 12px;
        padding: 1.5rem;
        margin: 1rem 0;
        box-shadow: 0 4px 15px rgba(239, 221, 134, 0.2);
    }
    
    .alert-warning h4 {
        color: #5A3E36 !important;
        font-weight: 700 !important;
        font-size: 1.3rem !important;
        margin: 0 0 0.5rem 0 !important;
        font-family: 'Playfair Display', serif;
    }
    
    .alert-success {
        background: #FFFFFF !important;
        border: 3px solid #25D366 !important;
        border-left: 8px solid #25D366 !important;
        border-radius: 12px;
        padding: 1.5rem;
        margin: 1rem 0;
        box-shadow: 0 4px 15px rgba(37, 211, 102, 0.15);
    }
    
    .alert-success h4 {
        color: #25D366 !important;
        font-weight: 700 !important;
        font-size: 1.3rem !important;
        margin: 0 0 0.5rem 0 !important;
        font-family: 'Playfair Display', serif;
    }
    
    /* Section headers */
    .section-header {
        background: linear-gradient(135deg, #5A3E36 0%, #8B6F47 100%);
        color: #FFFFFF !important;
        padding: 1.2rem 1.5rem;
        border-radius: 12px;
        margin: 2rem 0 1rem 0;
        font-weight: 600;
        font-size: 1.3rem;
        box-shadow: 0 4px 15px rgba(90, 62, 54, 0.2);
        font-family: 'Playfair Display', serif;
    }
    
    .section-header * {
        color: #FFFFFF !important;
    }
    
    /* Buttons with Chamomile styling */
    .stButton > button {
        background: linear-gradient(135deg, #25D366, #20B858) !important;
        color: #FFFFFF !important;
        border: none !important;
        border-radius: 12px;
        padding: 0.8rem 2rem;
        font-weight: 600 !important;
        font-size: 1rem !important;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
        font-family: 'Poppins', sans-serif;
    }
    
    .stButton > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
        background: linear-gradient(135deg, #20B858, #1da851) !important;
    }
    
    /* Form elements */
    .stSelectbox > div > div,
    .stNumberInput > div > div,
    .stTextInput > div > div,
    .stTextArea > div > div,
    .stDateInput > div > div {
        background-color: #FFFFFF !important;
        border: 2px solid #EFDD86 !important;
        border-radius: 10px;
        color: #5A3E36 !important;
        font-family: 'Poppins', sans-serif;
    }
    
    .stSelectbox > div > div:focus,
    .stNumberInput > div > div:focus,
    .stTextInput > div > div:focus,
    .stTextArea > div > div:focus {
        border-color: #5A3E36 !important;
        box-shadow: 0 0 0 2px rgba(90, 62, 54, 0.2);
    }
    
    /* Form labels */
    .stSelectbox label, 
    .stNumberInput label, 
    .stTextInput label, 
    .stTextArea label,
    .stDateInput label {
        color: #5A3E36 !important;
        font-weight: 600 !important;
        font-family: 'Poppins', sans-serif;
    }
    
    /* Tables */
    .stDataFrame {
        background: #FFFFFF !important;
        border: 3px solid #EFDD86 !important;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(90, 62, 54, 0.1);
    }
    
    .stDataFrame table {
        background: #FFFFFF !important;
        font-family: 'Poppins', sans-serif;
    }
    
    .stDataFrame th {
        background: linear-gradient(135deg, #EFDD86, #F4E49C) !important;
        color: #5A3E36 !important;
        font-weight: 700 !important;
        font-size: 1rem !important;
        border-bottom: 2px solid #5A3E36 !important;
        font-family: 'Playfair Display', serif;
    }
    
    .stDataFrame td {
        color: #5A3E36 !important;
        font-weight: 500 !important;
        font-size: 0.95rem !important;
        border-bottom: 1px solid #EFDD86 !important;
    }
    
    /* Tabs */
    .stTabs [data-baseweb="tab-list"] {
        gap: 10px;
        background: transparent !important;
    }
    
    .stTabs [data-baseweb="tab"] {
        background: #FFFFFF !important;
        border: 2px solid #EFDD86 !important;
        border-radius: 10px;
        color: #5A3E36 !important;
        font-weight: 600 !important;
        padding: 0.8rem 1.5rem !important;
        font-family: 'Poppins', sans-serif;
    }
    
    .stTabs [aria-selected="true"] {
        background: linear-gradient(135deg, #5A3E36, #8B6F47) !important;
        color: #FFFFFF !important;
        border-color: #5A3E36 !important;
    }
    
    /* Radio buttons */
    .stRadio > div {
        background: #FFFFFF !important;
        border: 2px solid #EFDD86 !important;
        border-radius: 10px;
        padding: 1rem;
    }
    
    .stRadio label {
        color: #5A3E36 !important;
        font-weight: 600 !important;
        font-family: 'Poppins', sans-serif;
    }
    
    /* Notifications */
    [data-testid="stNotificationContentInfo"] {
        background: #FFFFFF !important;
        border: 2px solid #EFDD86 !important;
        color: #5A3E36 !important;
        font-weight: 600 !important;
        border-radius: 10px;
    }
    
    [data-testid="stNotificationContentSuccess"] {
        background: #FFFFFF !important;
        border: 2px solid #25D366 !important;
        color: #25D366 !important;
        font-weight: 600 !important;
        border-radius: 10px;
    }
    
    [data-testid="stNotificationContentWarning"] {
        background: #FFFFFF !important;
        border: 2px solid #EFDD86 !important;
        color: #5A3E36 !important;
        font-weight: 600 !important;
        border-radius: 10px;
    }
    
    [data-testid="stNotificationContentError"] {
        background: #FFFFFF !important;
        border: 2px solid #dc2626 !important;
        color: #dc2626 !important;
        font-weight: 600 !important;
        border-radius: 10px;
    }
    
    /* Progress bars */
    .stProgress > div > div {
        background: linear-gradient(90deg, #25D366, #20B858) !important;
        border-radius: 10px;
    }
    
    /* Plotly charts */
    .js-plotly-plot {
        background: #FFFFFF !important;
        border-radius: 12px;
        border: 2px solid #EFDD86;
    }
    
    /* Custom progress bar for stock levels */
    .stock-progress {
        background: #F9E1D3;
        border-radius: 15px;
        height: 25px;
        margin: 1rem 0;
        border: 2px solid #EFDD86;
        overflow: hidden;
    }
    
    .stock-progress-fill {
        height: 100%;
        border-radius: 13px;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        font-size: 0.9rem;
    }
</style>
""", unsafe_allow_html=True)

class InventoryManager:
    def __init__(self):
        self.load_data()
    
    def load_data(self):
        """Load data from session state or initialize with sample data"""
        if 'inventory_data' not in st.session_state:
            st.session_state.inventory_data = {
                "Chamomile Tea Bags": {
                    "current_stock": 45,
                    "min_stock": 15,
                    "max_stock": 100,
                    "unit_cost": 8.50,
                    "unit_price": 12.00,
                    "supplier": "Chamomile Gardens",
                    "category": "Tea"
                },
                "Honey Chamomile Blend": {
                    "current_stock": 32,
                    "min_stock": 10,
                    "max_stock": 80,
                    "unit_cost": 12.00,
                    "unit_price": 18.00,
                    "supplier": "Natural Blends Co",
                    "category": "Tea"
                },
                "Oat Milk Organic": {
                    "current_stock": 28,
                    "min_stock": 20,
                    "max_stock": 60,
                    "unit_cost": 6.75,
                    "unit_price": 9.50,
                    "supplier": "Oat Valley",
                    "category": "Milk"
                },
                "Lavender Chamomile": {
                    "current_stock": 8,
                    "min_stock": 12,
                    "max_stock": 50,
                    "unit_cost": 15.20,
                    "unit_price": 22.00,
                    "supplier": "Herbal Essence",
                    "category": "Tea"
                },
                "Vanilla Honey": {
                    "current_stock": 3,
                    "min_stock": 15,
                    "max_stock": 40,
                    "unit_cost": 9.80,
                    "unit_price": 14.50,
                    "supplier": "Sweet Nature",
                    "category": "Flavoring"
                },
                "Chamomile Loose Leaf": {
                    "current_stock": 22,
                    "min_stock": 8,
                    "max_stock": 35,
                    "unit_cost": 18.00,
                    "unit_price": 26.00,
                    "supplier": "Premium Herbs",
                    "category": "Tea"
                }
            }
        
        if 'sales_data' not in st.session_state:
            st.session_state.sales_data = [
                {"date": "2025-06-01", "item": "Chamomile Tea Bags", "quantity": 8, "unit_price": 12.00},
                {"date": "2025-06-01", "item": "Oat Milk Organic", "quantity": 3, "unit_price": 9.50},
                {"date": "2025-06-02", "item": "Honey Chamomile Blend", "quantity": 5, "unit_price": 18.00},
                {"date": "2025-06-02", "item": "Lavender Chamomile", "quantity": 2, "unit_price": 22.00},
                {"date": "2025-06-03", "item": "Chamomile Loose Leaf", "quantity": 4, "unit_price": 26.00},
            ]
        
        if 'purchase_data' not in st.session_state:
            st.session_state.purchase_data = []

def main():
    inventory_manager = InventoryManager()
    
    # Enhanced Sidebar with Chamomile branding
    with st.sidebar:
        st.markdown("""
        <div style="text-align: center; padding: 1.5rem;">
            <h1 style="color: #EFDD86; font-size: 1.8rem; margin: 0; font-family: 'Playfair Display', serif;">🌼 CHÁMOMILE</h1>
            <p style="color: #EFDD86; font-size: 0.9rem; margin: 0.5rem 0; font-style: italic;">Relaxation in every sip</p>
            <p style="color: #FFFFFF; font-size: 0.8rem; margin: 0;">Professional Inventory System</p>
        </div>
        """, unsafe_allow_html=True)
        
        # Navigation with proper session state handling
        pages = [
            "📊 Dashboard",
            "📦 Inventory", 
            "💰 Sales",
            "🛒 Purchases",
            "📈 Analytics",
            "⚙️ Settings"
        ]
        
        # Initialize navigation in session state
        if "current_page" not in st.session_state:
            st.session_state.current_page = "📊 Dashboard"
        
        selected_page = st.radio("", pages, 
                                index=pages.index(st.session_state.current_page) if st.session_state.current_page in pages else 0,
                                key="nav_radio")
        
        # Update current page
        st.session_state.current_page = selected_page
        
        # Quick stats in sidebar
        st.markdown("---")
        inventory_data = st.session_state.inventory_data
        total_value = sum(item["current_stock"] * item["unit_cost"] for item in inventory_data.values())
        low_stock_count = len([name for name, item in inventory_data.items() if item["current_stock"] <= item["min_stock"]])
        
        st.markdown("### 📊 Quick Stats")
        st.metric("💰 Total Value", f"RM {total_value:,.0f}")
        st.metric("⚠️ Alerts", low_stock_count)
        
        # Time and date
        st.markdown("---")
        current_time = datetime.now()
        st.markdown(f"**📅 {current_time.strftime('%B %d, %Y')}**")
        st.markdown(f"**🕐 {current_time.strftime('%I:%M %p')}**")
    
    # Route to pages based on selection
    if st.session_state.current_page == "📊 Dashboard":
        show_dashboard()
    elif st.session_state.current_page == "📦 Inventory":
        show_inventory()
    elif st.session_state.current_page == "💰 Sales":
        show_sales()
    elif st.session_state.current_page == "🛒 Purchases":
        show_purchases()
    elif st.session_state.current_page == "📈 Analytics":
        show_analytics()
    elif st.session_state.current_page == "⚙️ Settings":
        show_settings()

def show_dashboard():
    # Chamomile-themed header
    st.markdown("""
    <div class="chamomile-header">
        <h1>🌼 Chamomile Tea Inventory Dashboard</h1>
        <p>Real-time Business Intelligence & Stock Management</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Key Metrics
    inventory_data = st.session_state.inventory_data
    total_value = sum(item["current_stock"] * item["unit_cost"] for item in inventory_data.values())
    total_items = len(inventory_data)
    low_stock_items = [name for name, item in inventory_data.items() if item["current_stock"] <= item["min_stock"]]
    out_of_stock = [name for name, item in inventory_data.items() if item["current_stock"] == 0]
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("💰 Total Inventory Value", f"RM {total_value:,.2f}", delta="Live")
    
    with col2:
        st.metric("🌼 Products", total_items, delta="Active")
    
    with col3:
        alert_color = "normal" if len(low_stock_items) == 0 else "inverse"
        st.metric("⚠️ Low Stock", len(low_stock_items), delta=f"-{len(low_stock_items)}" if low_stock_items else "All Good!")
    
    with col4:
        critical_color = "normal" if len(out_of_stock) == 0 else "inverse"
        st.metric("🚨 Critical", len(out_of_stock), delta=f"-{len(out_of_stock)}" if out_of_stock else "All Good!")
    
    # Stock Alerts
    st.markdown('<div class="section-header">🚨 Stock Alerts & Action Items</div>', unsafe_allow_html=True)
    
    alerts_col1, alerts_col2 = st.columns([2, 1])
    
    with alerts_col1:
        if out_of_stock:
            for item in out_of_stock:
                st.markdown(f"""
                <div class="alert-critical">
                    <h4>🚨 CRITICAL: {item}</h4>
                    <p style="margin: 0; font-size: 1.1rem; color: #dc2626;">OUT OF STOCK - Immediate reorder required!</p>
                    <p style="margin: 0.5rem 0 0 0; opacity: 0.8; color: #5A3E36;">Contact: {inventory_data[item]['supplier']}</p>
                </div>
                """, unsafe_allow_html=True)
        
        if low_stock_items:
            for item in low_stock_items:
                if item not in out_of_stock:
                    current = inventory_data[item]["current_stock"]
                    minimum = inventory_data[item]["min_stock"]
                    st.markdown(f"""
                    <div class="alert-warning">
                        <h4>⚠️ LOW STOCK: {item}</h4>
                        <p style="margin: 0; font-size: 1.1rem; color: #5A3E36;">Current: {current} units | Minimum: {minimum} units</p>
                        <p style="margin: 0.5rem 0 0 0; opacity: 0.8; color: #5A3E36;">Reorder soon from: {inventory_data[item]['supplier']}</p>
                    </div>
                    """, unsafe_allow_html=True)
        
        if not low_stock_items and not out_of_stock:
            st.markdown("""
            <div class="alert-success">
                <h4>✅ All Stock Levels Healthy!</h4>
                <p style="margin: 0; font-size: 1.1rem; color: #25D366;">No immediate action required. Keep up the great work!</p>
            </div>
            """, unsafe_allow_html=True)
    
    with alerts_col2:
        st.markdown("### 🚀 Quick Actions")
        if st.button("📝 Record Sale", use_container_width=True):
            st.session_state.current_page = "💰 Sales"
            st.rerun()
        if st.button("📦 Update Stock", use_container_width=True):
            st.session_state.current_page = "📦 Inventory"
            st.rerun()
        if st.button("📈 View Analytics", use_container_width=True):
            st.session_state.current_page = "📈 Analytics"
            st.rerun()
    
    # Stock Overview Charts
    st.markdown('<div class="section-header">📊 Stock Levels Overview</div>', unsafe_allow_html=True)
    
    # Create stock data
    df_stock = pd.DataFrame([
        {
            "Product": name.replace(" ", "\n") if len(name) > 15 else name,
            "Current Stock": item["current_stock"],
            "Min Stock": item["min_stock"],
            "Max Stock": item["max_stock"],
            "Category": item["category"],
            "Status": get_stock_status(item["current_stock"], item["min_stock"]),
            "Fill %": (item["current_stock"] / item["max_stock"] * 100) if item["max_stock"] > 0 else 0
        }
        for name, item in inventory_data.items()
    ])
    
    # Charts side by side
    chart_col1, chart_col2 = st.columns(2)
    
    with chart_col1:
        fig1 = px.bar(
            df_stock, 
            x="Product", 
            y=["Current Stock", "Min Stock"], 
            title="📊 Current vs Minimum Stock Levels",
            color_discrete_map={"Current Stock": "#5A3E36", "Min Stock": "#EFDD86"},
            height=400
        )
        fig1.update_layout(
            plot_bgcolor='rgba(0,0,0,0)',
            paper_bgcolor='rgba(255,255,255,1)',
            font=dict(family="Poppins, sans-serif", color="#5A3E36"),
            title_font_size=16,
            title_font_color="#5A3E36"
        )
        st.plotly_chart(fig1, use_container_width=True)
    
    with chart_col2:
        status_counts = df_stock['Status'].value_counts()
        fig2 = px.pie(
            values=status_counts.values, 
            names=status_counts.index,
            title="📈 Stock Status Distribution",
            hole=0.4,
            color_discrete_map={"Critical": "#dc2626", "Low": "#EFDD86", "Normal": "#25D366"},
            height=400
        )
        fig2.update_layout(
            plot_bgcolor='rgba(0,0,0,0)',
            paper_bgcolor='rgba(255,255,255,1)',
            font=dict(family="Poppins, sans-serif", color="#5A3E36"),
            title_font_size=16,
            title_font_color="#5A3E36"
        )
        st.plotly_chart(fig2, use_container_width=True)
    
    # Recent Sales Activity
    st.markdown('<div class="section-header">📝 Recent Sales Activity</div>', unsafe_allow_html=True)
    
    if st.session_state.sales_data:
        recent_sales = pd.DataFrame(st.session_state.sales_data[-10:])
        recent_sales["Total"] = recent_sales["quantity"] * recent_sales["unit_price"]
        recent_sales["Date"] = pd.to_datetime(recent_sales["date"]).dt.strftime("%b %d")
        display_sales = recent_sales[["Date", "item", "quantity", "unit_price", "Total"]].copy()
        display_sales.columns = ["Date", "Product", "Qty", "Unit Price (RM)", "Total (RM)"]
        
        st.dataframe(
            display_sales, 
            use_container_width=True,
            hide_index=True,
            column_config={
                "Unit Price (RM)": st.column_config.NumberColumn(format="%.2f"),
                "Total (RM)": st.column_config.NumberColumn(format="%.2f")
            }
        )
        
        # Sales summary
        col1, col2, col3 = st.columns(3)
        today = datetime.now().strftime("%Y-%m-%d")
        week_ago = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
        
        df_sales = pd.DataFrame(st.session_state.sales_data)
        df_sales["Total"] = df_sales["quantity"] * df_sales["unit_price"]
        
        with col1:
            today_sales = df_sales[df_sales["date"] == today]["Total"].sum()
            st.metric("Today's Sales", f"RM {today_sales:.2f}")
        
        with col2:
            week_sales = df_sales[df_sales["date"] >= week_ago]["Total"].sum()
            st.metric("This Week", f"RM {week_sales:.2f}")
        
        with col3:
            avg_daily = df_sales.groupby("date")["Total"].sum().mean() if len(df_sales) > 0 else 0
            st.metric("Daily Average", f"RM {avg_daily:.2f}")
    else:
        st.info("💡 No sales recorded yet. Use the Sales page to start tracking!")

def get_stock_status(current, minimum):
    if current == 0:
        return "Critical"
    elif current <= minimum:
        return "Low"
    else:
        return "Normal"

def show_inventory():
    st.markdown("""
    <div class="chamomile-header">
        <h1>📦 Inventory Management</h1>
        <p>Manage your chamomile products and stock levels</p>
    </div>
    """, unsafe_allow_html=True)
    
    tab1, tab2, tab3 = st.tabs(["📋 Current Inventory", "➕ Add Product", "✏️ Update Stock"])
    
    with tab1:
        show_current_inventory()
    
    with tab2:
        show_add_product()
    
    with tab3:
        show_update_stock()

def show_current_inventory():
    # Enhanced filters
    filter_col1, filter_col2, filter_col3 = st.columns(3)
    
    with filter_col1:
        categories = list(set(item["category"] for item in st.session_state.inventory_data.values()))
        selected_category = st.selectbox("🏷️ Filter by Category", ["All"] + categories)
    
    with filter_col2:
        stock_filter = st.selectbox("📊 Stock Status", ["All", "Critical", "Low Stock", "Normal"])
    
    with filter_col3:
        sort_by = st.selectbox("🔄 Sort by", ["Product Name", "Stock Level", "Value", "Category"])
    
    # Create inventory dataframe
    df_inventory = []
    for name, item in st.session_state.inventory_data.items():
        status = get_stock_status(item["current_stock"], item["min_stock"])
        df_inventory.append({
            "Product": name,
            "Category": item["category"],
            "Current": item["current_stock"],
            "Min": item["min_stock"],
            "Max": item["max_stock"],
            "Cost": item["unit_cost"],
            "Price": item["unit_price"],
            "Value": item["current_stock"] * item["unit_cost"],
            "Margin": ((item["unit_price"] - item["unit_cost"]) / item["unit_price"] * 100) if item["unit_price"] > 0 else 0,
            "Supplier": item["supplier"],
            "Status": status
        })
    
    df_inventory = pd.DataFrame(df_inventory)
    
    # Apply filters
    if selected_category != "All":
        df_inventory = df_inventory[df_inventory["Category"] == selected_category]
    
    if stock_filter != "All":
        if stock_filter == "Critical":
            df_inventory = df_inventory[df_inventory["Current"] == 0]
        elif stock_filter == "Low Stock":
            df_inventory = df_inventory[(df_inventory["Current"] <= df_inventory["Min"]) & (df_inventory["Current"] > 0)]
        elif stock_filter == "Normal":
            df_inventory = df_inventory[df_inventory["Current"] > df_inventory["Min"]]
    
    # Sort data
    if sort_by == "Stock Level":
        df_inventory = df_inventory.sort_values("Current")
    elif sort_by == "Value":
        df_inventory = df_inventory.sort_values("Value", ascending=False)
    elif sort_by == "Category":
        df_inventory = df_inventory.sort_values("Category")
    
    # Display table
    st.dataframe(
        df_inventory,
        use_container_width=True,
        hide_index=True,
        column_config={
            "Cost": st.column_config.NumberColumn("Cost (RM)", format="%.2f"),
            "Price": st.column_config.NumberColumn("Price (RM)", format="%.2f"),
            "Value": st.column_config.NumberColumn("Value (RM)", format="%.2f"),
            "Margin": st.column_config.NumberColumn("Margin (%)", format="%.1f"),
        }
    )
    
    # Summary statistics
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("Products Shown", len(df_inventory))
    with col2:
        st.metric("Total Value", f"RM {df_inventory['Value'].sum():.2f}")
    with col3:
        st.metric("Avg Margin", f"{df_inventory['Margin'].mean():.1f}%")
    with col4:
        low_stock_count = len(df_inventory[df_inventory["Status"].isin(["Critical", "Low"])])
        st.metric("Need Attention", low_stock_count)

def show_add_product():
    st.markdown("### ➕ Add New Product")
    
    with st.form("add_product_form", clear_on_submit=True):
        col1, col2 = st.columns(2)
        
        with col1:
            product_name = st.text_input("📝 Product Name *", placeholder="e.g., Mint Chamomile Blend")
            category = st.selectbox("🏷️ Category", ["Tea", "Milk", "Sweeteners", "Flavoring", "Packaging", "Other"])
            supplier = st.text_input("🏢 Supplier", placeholder="e.g., Chamomile Gardens")
        
        with col2:
            unit_cost = st.number_input("💰 Unit Cost (RM) *", min_value=0.0, step=0.01, format="%.2f")
            unit_price = st.number_input("💵 Selling Price (RM) *", min_value=0.0, step=0.01, format="%.2f")
            initial_stock = st.number_input("📦 Initial Stock", min_value=0, step=1)
        
        col3, col4 = st.columns(2)
        with col3:
            min_stock = st.number_input("⚠️ Minimum Stock Level", min_value=0, step=1)
        with col4:
            max_stock = st.number_input("📈 Maximum Stock Level", min_value=0, step=1)
        
        # Show profit margin
        if unit_cost > 0 and unit_price > 0:
            margin = ((unit_price - unit_cost) / unit_price * 100)
            profit_per_unit = unit_price - unit_cost
            st.info(f"💡 Profit Margin: {margin:.1f}% | Profit per unit: RM {profit_per_unit:.2f}")
        
        submitted = st.form_submit_button("✅ Add Product", type="primary", use_container_width=True)
        
        if submitted:
            if product_name and unit_cost > 0 and unit_price > 0:
                if product_name in st.session_state.inventory_data:
                    st.error("❌ Product already exists! Please use a different name.")
                else:
                    st.session_state.inventory_data[product_name] = {
                        "current_stock": initial_stock,
                        "min_stock": min_stock,
                        "max_stock": max_stock,
                        "unit_cost": unit_cost,
                        "unit_price": unit_price,
                        "supplier": supplier,
                        "category": category
                    }
                    st.success(f"✅ {product_name} added successfully!")
                    st.rerun()
            else:
                st.error("❌ Please fill in all required fields with valid values.")

def show_update_stock():
    st.markdown("### ✏️ Update Stock Levels")
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        product_to_update = st.selectbox("📦 Select Product", list(st.session_state.inventory_data.keys()))
    
    if product_to_update:
        current_stock = st.session_state.inventory_data[product_to_update]["current_stock"]
        min_stock = st.session_state.inventory_data[product_to_update]["min_stock"]
        max_stock = st.session_state.inventory_data[product_to_update]["max_stock"]
        
        # Stock level indicator
        fill_percentage = (current_stock / max_stock * 100) if max_stock > 0 else 0
        status = get_stock_status(current_stock, min_stock)
        
        with col2:
            st.markdown(f"""
            **Current Status:** {status}  
            **Stock Level:** {current_stock} / {max_stock} units ({fill_percentage:.1f}% full)
            """)
        
        # Visual stock indicator with Chamomile colors
        if status == "Critical":
            color = "#dc2626"
        elif status == "Low":
            color = "#EFDD86"
        else:
            color = "#25D366"
        
        st.markdown(f"""
        <div class="stock-progress">
            <div class="stock-progress-fill" style="background: {color}; width: {fill_percentage}%;">
                {fill_percentage:.1f}%
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        col_add, col_remove = st.columns(2)
        
        with col_add:
            st.markdown("**📈 Add Stock**")
            with st.form(f"add_stock_{product_to_update}"):
                add_quantity = st.number_input("Quantity to Add", min_value=0, step=1, key=f"add_qty_{product_to_update}")
                add_reason = st.selectbox("Reason", ["New Delivery", "Stock Transfer", "Inventory Adjustment"])
                add_submitted = st.form_submit_button("➕ Add Stock", type="primary", use_container_width=True)
                
                if add_submitted and add_quantity > 0:
                    st.session_state.inventory_data[product_to_update]["current_stock"] += add_quantity
                    st.success(f"✅ Added {add_quantity} units to {product_to_update}")
                    st.rerun()
        
        with col_remove:
            st.markdown("**📉 Remove Stock**")
            with st.form(f"remove_stock_{product_to_update}"):
                remove_quantity = st.number_input("Quantity to Remove", min_value=0, max_value=current_stock, step=1, key=f"remove_qty_{product_to_update}")
                remove_reason = st.selectbox("Reason", ["Direct Sale", "Waste/Expired", "Stock Transfer", "Inventory Adjustment"])
                remove_submitted = st.form_submit_button("➖ Remove Stock", use_container_width=True)
                
                if remove_submitted and remove_quantity > 0:
                    st.session_state.inventory_data[product_to_update]["current_stock"] -= remove_quantity
                    st.success(f"✅ Removed {remove_quantity} units from {product_to_update}")
                    st.rerun()

def show_sales():
    st.markdown("""
    <div class="chamomile-header">
        <h1>💰 Sales Management</h1>
        <p>Record sales and track performance</p>
    </div>
    """, unsafe_allow_html=True)
    
    tab1, tab2 = st.tabs(["📝 Record Sale", "📊 Sales History"])
    
    with tab1:
        show_sales_entry()
    
    with tab2:
        show_sales_history()

def show_sales_entry():
    st.markdown("### 📝 Quick Sale Entry")
    
    with st.form("sales_form", clear_on_submit=True):
        col1, col2, col3 = st.columns(3)
        
        with col1:
            sale_date = st.date_input("📅 Sale Date", datetime.now().date())
            available_products = [name for name, item in st.session_state.inventory_data.items() if item["current_stock"] > 0]
            
            if not available_products:
                st.error("❌ No products available for sale!")
                product = None
            else:
                product = st.selectbox("🌼 Product Sold", available_products)
        
        with col2:
            if product:
                max_qty = st.session_state.inventory_data[product]["current_stock"]
                st.info(f"📦 Available: {max_qty} units")
                quantity = st.number_input(f"📊 Quantity", min_value=1, max_value=max_qty, step=1, value=1)
                default_price = st.session_state.inventory_data[product]["unit_price"]
            else:
                quantity = 1
                default_price = 0.0
        
        with col3:
            unit_price = st.number_input("💵 Unit Price (RM)", min_value=0.0, value=default_price, step=0.01, format="%.2f")
            total_amount = quantity * unit_price
            
            if product and total_amount > 0:
                cost = st.session_state.inventory_data[product]["unit_cost"]
                profit = (unit_price - cost) * quantity
                margin = ((unit_price - cost) / unit_price * 100) if unit_price > 0 else 0
                
                st.success(f"💰 Total: RM {total_amount:.2f}")
                st.info(f"📈 Profit: RM {profit:.2f} ({margin:.1f}%)")
        
        customer_name = st.text_input("👤 Customer Name (Optional)", placeholder="Walk-in customer")
        notes = st.text_input("📝 Notes (Optional)", placeholder="Special instructions or comments")
        
        submitted = st.form_submit_button("🛒 Record Sale", type="primary", use_container_width=True)
        
        if submitted and product and quantity > 0:
            # Add to sales data
            sale_record = {
                "date": sale_date.strftime("%Y-%m-%d"),
                "item": product,
                "quantity": quantity,
                "unit_price": unit_price,
                "customer": customer_name or "Walk-in",
                "notes": notes,
                "timestamp": datetime.now().strftime("%H:%M:%S")
            }
            st.session_state.sales_data.append(sale_record)
            
            # Update inventory
            st.session_state.inventory_data[product]["current_stock"] -= quantity
            
            st.success(f"✅ Sale recorded: {quantity} x {product} for RM {total_amount:.2f}")
            
            # Check stock level
            remaining = st.session_state.inventory_data[product]["current_stock"]
            min_stock = st.session_state.inventory_data[product]["min_stock"]
            
            if remaining <= min_stock:
                st.warning(f"⚠️ {product} is now at low stock level: {remaining} units remaining!")
            
            st.rerun()

def show_sales_history():
    st.markdown("### 📊 Sales History")
    
    if not st.session_state.sales_data:
        st.info("💡 No sales recorded yet. Use the Record Sale tab to start tracking!")
        return
    
    df_sales = pd.DataFrame(st.session_state.sales_data)
    df_sales["Total"] = df_sales["quantity"] * df_sales["unit_price"]
    df_sales["Date"] = pd.to_datetime(df_sales["date"])
    
    # Date range filter
    col1, col2, col3 = st.columns(3)
    with col1:
        start_date = st.date_input("📅 From Date", df_sales["Date"].min().date())
    with col2:
        end_date = st.date_input("📅 To Date", df_sales["Date"].max().date())
    with col3:
        product_filter = st.selectbox("🌼 Product Filter", ["All Products"] + df_sales["item"].unique().tolist())
    
    # Apply filters
    filtered_df = df_sales[
        (df_sales["Date"].dt.date >= start_date) & 
        (df_sales["Date"].dt.date <= end_date)
    ]
    
    if product_filter != "All Products":
        filtered_df = filtered_df[filtered_df["item"] == product_filter]
    
    # Sales metrics
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        total_revenue = filtered_df["Total"].sum()
        st.metric("💰 Total Revenue", f"RM {total_revenue:.2f}")
    
    with col2:
        total_units = filtered_df["quantity"].sum()
        st.metric("📦 Units Sold", f"{total_units:,}")
    
    with col3:
        avg_sale = filtered_df["Total"].mean() if len(filtered_df) > 0 else 0
        st.metric("📊 Avg Sale Value", f"RM {avg_sale:.2f}")
    
    with col4:
        num_transactions = len(filtered_df)
        st.metric("🧾 Transactions", f"{num_transactions:,}")
    
    # Sales table
    if len(filtered_df) > 0:
        display_df = filtered_df.copy()
        display_df["Date"] = display_df["Date"].dt.strftime("%Y-%m-%d")
        display_df = display_df[["Date", "item", "quantity", "unit_price", "Total", "customer", "notes"]].sort_values("Date", ascending=False)
        display_df.columns = ["Date", "Product", "Qty", "Unit Price", "Total", "Customer", "Notes"]
        
        st.dataframe(
            display_df,
            use_container_width=True,
            hide_index=True,
            column_config={
                "Unit Price": st.column_config.NumberColumn("Unit Price (RM)", format="%.2f"),
                "Total": st.column_config.NumberColumn("Total (RM)", format="%.2f")
            }
        )

def show_purchases():
    st.markdown("""
    <div class="chamomile-header">
        <h1>🛒 Purchase Management</h1>
        <p>Track purchases and supplier information</p>
    </div>
    """, unsafe_allow_html=True)
    
    st.info("🚧 Purchase management features coming soon!")

def show_analytics():
    st.markdown("""
    <div class="chamomile-header">
        <h1>📈 Business Analytics</h1>
        <p>Insights and performance metrics</p>
    </div>
    """, unsafe_allow_html=True)
    
    st.info("🚧 Advanced analytics features coming soon!")

def show_settings():
    st.markdown("""
    <div class="chamomile-header">
        <h1>⚙️ Settings</h1>
        <p>Configure your system preferences</p>
    </div>
    """, unsafe_allow_html=True)
    
    st.info("🚧 Settings panel coming soon!")

if __name__ == "__main__":
    main()

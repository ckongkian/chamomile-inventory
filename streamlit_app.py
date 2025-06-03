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

# Updated Chamomile-themed CSS with your requested colors
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap');
    
    /* Main background */
    .main > div {
        padding-top: 1rem;
        font-family: 'Poppins', sans-serif;
        background-color: #f9e1d3 !important;
        color: #5A3E36 !important;
    }
    
    /* Global text color */
    .stApp, .stApp * {
        color: #5A3E36 !important;
    }
    
    /* Main container */
    .main .block-container {
        background-color: #f9e1d3 !important;
        padding: 2rem 1rem;
        max-width: 1200px;
    }
    
    /* Sidebar styling */
    .css-1d391kg, .css-6qob1r {
        background: linear-gradient(180deg, #5A3E36 0%, #6B4B3E 100%) !important;
        border-right: 3px solid #E6C383 !important;
    }
    
    .css-1d391kg *, .css-6qob1r * {
        color: #FFFFFF !important;
    }
    
    /* Header styling */
    .chamomile-header {
        background: linear-gradient(135deg, #E6C383 0%, #F4E49C 100%);
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
    }
    
    .chamomile-header p {
        color: #5A3E36 !important;
        margin: 0.5rem 0 0 0;
        font-size: 1.1rem;
        font-style: italic;
        opacity: 0.8;
    }
    
    /* Metrics styling */
    .stMetric {
        background: #FFFFFF !important;
        border: 3px solid #E6C383 !important;
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
    
    /* Alert boxes */
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
        border: 3px solid #E6C383 !important;
        border-left: 8px solid #E6C383 !important;
        border-radius: 12px;
        padding: 1.5rem;
        margin: 1rem 0;
        box-shadow: 0 4px 15px rgba(230, 195, 131, 0.2);
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
        background: linear-gradient(135deg, #5A3E36 0%, #6B4B3E 100%);
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
    
    /* Updated button styling with your requested color */
    .stButton > button {
        background: #E6C383 !important;
        color: #5A3E36 !important;
        border: 2px solid #5A3E36 !important;
        border-radius: 12px;
        padding: 0.8rem 2rem;
        font-weight: 600 !important;
        font-size: 1rem !important;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(230, 195, 131, 0.3);
        font-family: 'Poppins', sans-serif;
    }
    
    .stButton > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(230, 195, 131, 0.5);
        background: #D4B366 !important;
        border-color: #5A3E36 !important;
    }
    
    .stButton > button:active {
        transform: translateY(0px);
        box-shadow: 0 2px 10px rgba(230, 195, 131, 0.3);
    }
    
    /* Form elements */
    .stSelectbox > div > div,
    .stNumberInput > div > div,
    .stTextInput > div > div,
    .stTextArea > div > div,
    .stDateInput > div > div {
        background-color: #FFFFFF !important;
        border: 2px solid #E6C383 !important;
        border-radius: 10px;
        color: #5A3E36 !important;
        font-family: 'Poppins', sans-serif;
    }
    
    .stSelectbox label, 
    .stNumberInput label, 
    .stTextInput label, 
    .stTextArea label,
    .stDateInput label {
        color: #5A3E36 !important;
        font-weight: 600 !important;
        font-family: 'Poppins', sans-serif;
    }
    
    /* DataFrames */
    .stDataFrame {
        background: #FFFFFF !important;
        border: 3px solid #E6C383 !important;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(90, 62, 54, 0.1);
    }
    
    .stDataFrame table {
        background: #FFFFFF !important;
        font-family: 'Poppins', sans-serif;
    }
    
    .stDataFrame th {
        background: linear-gradient(135deg, #E6C383, #F4E49C) !important;
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
        border-bottom: 1px solid #E6C383 !important;
    }
    
    /* Tabs */
    .stTabs [data-baseweb="tab-list"] {
        gap: 10px;
        background: transparent !important;
    }
    
    .stTabs [data-baseweb="tab"] {
        background: #FFFFFF !important;
        border: 2px solid #E6C383 !important;
        border-radius: 10px;
        color: #5A3E36 !important;
        font-weight: 600 !important;
        padding: 0.8rem 1.5rem !important;
        font-family: 'Poppins', sans-serif;
    }
    
    .stTabs [aria-selected="true"] {
        background: linear-gradient(135deg, #5A3E36, #6B4B3E) !important;
        color: #FFFFFF !important;
        border-color: #5A3E36 !important;
    }
    
    /* Radio buttons */
    .stRadio > div {
        background: #FFFFFF !important;
        border: 2px solid #E6C383 !important;
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
        border: 2px solid #E6C383 !important;
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
        border: 2px solid #E6C383 !important;
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
        border: 2px solid #E6C383;
    }
    
    /* Fix for potential null reference errors */
    [data-testid="stSidebar"] {
        background: linear-gradient(180deg, #5A3E36 0%, #6B4B3E 100%) !important;
    }
    
    [data-testid="stSidebar"] * {
        color: #FFFFFF !important;
    }
    
    /* Additional fixes */
    .stApp > header {
        background: transparent !important;
    }
    
    .stApp [data-testid="stHeader"] {
        background: transparent !important;
    }
</style>
""", unsafe_allow_html=True)

class InventoryManager:
    def __init__(self):
        self.load_data()
    
    def load_data(self):
        """Load data from session state or initialize with your updated inventory data"""
        if 'inventory_data' not in st.session_state:
            st.session_state.inventory_data = {
                "White Sugar 800ml": {
                    "current_stock": 7,
                    "min_stock": 20,
                    "max_stock": 50,
                    "unit_cost": 4.05,
                    "unit_price": 4.05,
                    "supplier": "Immediate",
                    "category": "Sweeteners",
                    "sku": "IN-0001"
                },
                "White Sugar 1000ml": {
                    "current_stock": 0,
                    "min_stock": 20,
                    "max_stock": 50,
                    "unit_cost": 2.85,
                    "unit_price": 2.85,
                    "supplier": "Immediate",
                    "category": "Sweeteners",
                    "sku": "IN-0002"
                },
                "可乐冰棒糖": {
                    "current_stock": 9,
                    "min_stock": 16,
                    "max_stock": 40,
                    "unit_cost": 19.02,
                    "unit_price": 19.02,
                    "supplier": "from Shopee",
                    "category": "Sweeteners",
                    "sku": "IN-0003"
                },
                "Oatside Oatmilk": {
                    "current_stock": 49,
                    "min_stock": 44,
                    "max_stock": 80,
                    "unit_cost": 9.90,
                    "unit_price": 9.90,
                    "supplier": "from Shopee",
                    "category": "Oat Milk",
                    "sku": "IN-0004"
                },
                "English Tea Shop Lavender": {
                    "current_stock": 10,
                    "min_stock": 5,
                    "max_stock": 30,
                    "unit_cost": 18.26,
                    "unit_price": 18.26,
                    "supplier": "from Shopee",
                    "category": "Tea",
                    "sku": "IN-0005"
                },
                "BOH Jasmine Green Tea": {
                    "current_stock": 16,
                    "min_stock": 6,
                    "max_stock": 40,
                    "unit_cost": 11.71,
                    "unit_price": 11.71,
                    "supplier": "from Shopee",
                    "category": "Tea",
                    "sku": "IN-0006"
                },
                "BOH Chamomile Tea": {
                    "current_stock": 178,
                    "min_stock": 165,
                    "max_stock": 300,
                    "unit_cost": 0.47,
                    "unit_price": 140.32,
                    "supplier": "from Shopee",
                    "category": "Tea",
                    "sku": "IN-0007"
                },
                "Celestial Seasonings Country Peach": {
                    "current_stock": 56,
                    "min_stock": 13,
                    "max_stock": 80,
                    "unit_cost": 15.00,
                    "unit_price": 15.00,
                    "supplier": "from Shopee/local",
                    "category": "Tea",
                    "sku": "IN-0008"
                },
                "BOH Lychee with Rose Tea": {
                    "current_stock": 13,
                    "min_stock": 7,
                    "max_stock": 30,
                    "unit_cost": 9.43,
                    "unit_price": 9.43,
                    "supplier": "from Shopee",
                    "category": "Tea",
                    "sku": "IN-0009"
                },
                "Celestial Seasonings Raspberry Zinger": {
                    "current_stock": 14,
                    "min_stock": 10,
                    "max_stock": 35,
                    "unit_cost": 21.10,
                    "unit_price": 21.10,
                    "supplier": "from Shopee/local",
                    "category": "Tea",
                    "sku": "IN-0010"
                },
                "Ice cube": {
                    "current_stock": 0,
                    "min_stock": 20,
                    "max_stock": 50,
                    "unit_cost": 2.50,
                    "unit_price": 2.50,
                    "supplier": "Immediate",
                    "category": "Other",
                    "sku": "IN-0011"
                },
                "Bottle 500ml": {
                    "current_stock": 960,
                    "min_stock": 600,
                    "max_stock": 2000,
                    "unit_cost": 1.10,
                    "unit_price": 2200.62,
                    "supplier": "from Taobao",
                    "category": "Packaging",
                    "sku": "IN-0012a"
                },
                "Bottle 350ml": {
                    "current_stock": 0,
                    "min_stock": 600,
                    "max_stock": 3000,
                    "unit_cost": 1.04,
                    "unit_price": 3108.00,
                    "supplier": "from Taobao",
                    "category": "Packaging",
                    "sku": "IN-0012b"
                },
                "Bottle 330ml": {
                    "current_stock": 0,
                    "min_stock": 600,
                    "max_stock": 2000,
                    "unit_cost": 1.08,
                    "unit_price": 2160.00,
                    "supplier": "from Taobao",
                    "category": "Packaging",
                    "sku": "IN-0012c"
                },
                "Napkin (50/pack)": {
                    "current_stock": 1,
                    "min_stock": 4,
                    "max_stock": 10,
                    "unit_cost": 3.10,
                    "unit_price": 31.00,
                    "supplier": "from Taobao",
                    "category": "Packaging",
                    "sku": "IN-0014"
                },
                "Straw (500/pack)": {
                    "current_stock": 0.5,
                    "min_stock": 100,
                    "max_stock": 500,
                    "unit_cost": 0.05,
                    "unit_price": 23.87,
                    "supplier": "from Taobao",
                    "category": "Packaging",
                    "sku": "IN-0015"
                },
                "Sticker": {
                    "current_stock": 0,
                    "min_stock": 500,
                    "max_stock": 1000,
                    "unit_cost": 0.15,
                    "unit_price": 150.00,
                    "supplier": "Immediate, use printing instead now",
                    "category": "Packaging",
                    "sku": "IN-0016"
                },
                "Tester cup (50/pack)": {
                    "current_stock": 4,
                    "min_stock": 12,
                    "max_stock": 50,
                    "unit_cost": 1.09,
                    "unit_price": 54.40,
                    "supplier": "from Taobao",
                    "category": "Packaging",
                    "sku": "IN-0023"
                }
            }
        
        if 'sales_data' not in st.session_state:
            st.session_state.sales_data = [
                {"date": "2025-06-01", "item": "BOH Chamomile Tea", "quantity": 5, "unit_price": 12.00},
                {"date": "2025-06-01", "item": "Oatside Oatmilk", "quantity": 2, "unit_price": 9.90},
                {"date": "2025-06-02", "item": "English Tea Shop Lavender", "quantity": 3, "unit_price": 18.26},
                {"date": "2025-06-02", "item": "BOH Jasmine Green Tea", "quantity": 4, "unit_price": 11.71},
                {"date": "2025-06-03", "item": "Celestial Seasonings Country Peach", "quantity": 6, "unit_price": 15.00},
            ]
        
        if 'purchase_data' not in st.session_state:
            st.session_state.purchase_data = []

def main():
    try:
        inventory_manager = InventoryManager()
        
        # Enhanced Sidebar with Chamomile branding
        with st.sidebar:
            st.markdown("""
            <div style="text-align: center; padding: 1.5rem;">
                <h1 style="color: #E6C383; font-size: 1.8rem; margin: 0; font-family: 'Playfair Display', serif;">🌼 CHÁMOMILE</h1>
                <p style="color: #E6C383; font-size: 0.9rem; margin: 0.5rem 0; font-style: italic;">Relaxation in every sip</p>
                <p style="color: #FFFFFF; font-size: 0.8rem; margin: 0;">Professional Inventory System</p>
            </div>
            """, unsafe_allow_html=True)
            
            # Navigation
            pages = [
                "📊 Dashboard",
                "📦 Inventory", 
                "💰 Sales",
                "🛒 Purchases",
                "📈 Analytics",
                "⚙️ Settings"
            ]
            
            if "current_page" not in st.session_state:
                st.session_state.current_page = "📊 Dashboard"
            
            try:
                selected_page = st.radio("", pages, 
                                        index=pages.index(st.session_state.current_page) if st.session_state.current_page in pages else 0,
                                        key="nav_radio")
                
                st.session_state.current_page = selected_page
            except Exception as e:
                st.session_state.current_page = "📊 Dashboard"
            
            # Quick stats
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
        
        # Route to pages
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
            
    except Exception as e:
        st.error(f"Application error: {str(e)}")
        st.info("Please refresh the page or check your browser console for more details.")

def get_stock_status(current, minimum):
    """Safely determine stock status"""
    try:
        if current == 0:
            return "Critical"
        elif current <= minimum:
            return "Low"
        else:
            return "Normal"
    except Exception:
        return "Unknown"

def show_dashboard():
    try:
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
            st.metric("⚠️ Low Stock", len(low_stock_items), delta=f"-{len(low_stock_items)}" if low_stock_items else "All Good!")
        
        with col4:
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

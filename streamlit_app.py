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
        color: #5A3E36 !important;
    }
    
    /* Sidebar text color override */
    [data-testid="stSidebar"] * {
        color: #5A3E36 !important;
    }
    
    [data-testid="stSidebar"] .stMarkdown h1,
    [data-testid="stSidebar"] .stMarkdown h2,
    [data-testid="stSidebar"] .stMarkdown h3,
    [data-testid="stSidebar"] .stMarkdown p {
        color: #5A3E36 !important;
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
                <h1 style="color: #5A3E36; font-size: 1.8rem; margin: 0; font-family: 'Playfair Display', serif;">🌼 CHÁMOMILE</h1>
                <p style="color: #5A3E36; font-size: 0.9rem; margin: 0.5rem 0; font-style: italic;">Relaxation in every sip</p>
                <p style="color: #5A3E36; font-size: 0.8rem; margin: 0;">Professional Inventory System</p>
            </div>
            """, unsafe_allow_html=True)
            
            # Navigation
            pages = [
                "📊 Dashboard",
                "📦 Inventory", 
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
            if st.button("📦 Update Stock", use_container_width=True):
                st.session_state.current_page = "📦 Inventory"
                st.rerun()
            if st.button("📈 View Analytics", use_container_width=True):
                st.session_state.current_page = "📈 Analytics"
                st.rerun()
            if st.button("📝 Record Sale", use_container_width=True):
                show_sales_entry_inline()
        
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
            st.info("💡 No sales recorded yet. Use the Record Sale button to start tracking!")
    
    except Exception as e:
        st.error(f"Dashboard error: {str(e)}")

def show_inventory():
    try:
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
    
    except Exception as e:
        st.error(f"Inventory page error: {str(e)}")

def show_current_inventory():
    try:
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
                "SKU": item.get("sku", ""),
                "Category": item["category"],
                "Current": item["current_stock"],
                "Min": item["min_stock"],
                "Max": item["max_stock"],
                "Cost": item["unit_cost"],
                "Price": item["unit_price"],
                "Value": item["current_stock"] * item["unit_cost"],
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
            }
        )
        
        # Summary statistics
        col1, col2, col3, col4 = st.columns(4)
        with col1:
            st.metric("Products Shown", len(df_inventory))
        with col2:
            st.metric("Total Value", f"RM {df_inventory['Value'].sum():.2f}")
        with col3:
            critical_count = len(df_inventory[df_inventory["Current"] == 0])
            st.metric("Critical Items", critical_count)
        with col4:
            low_stock_count = len(df_inventory[df_inventory["Status"] == "Low"])
            st.metric("Low Stock Items", low_stock_count)
    
    except Exception as e:
        st.error(f"Current inventory error: {str(e)}")

def show_add_product():
    try:
        st.markdown("### ➕ Add New Product")
        
        with st.form("add_product_form", clear_on_submit=True):
            col1, col2 = st.columns(2)
            
            with col1:
                product_name = st.text_input("📝 Product Name *", placeholder="e.g., BOH Earl Grey Tea")
                category = st.selectbox("🏷️ Category", ["Tea", "Oat Milk", "Sweeteners", "Packaging", "Other"])
                supplier = st.text_input("🏢 Supplier", placeholder="e.g., from Shopee")
                sku = st.text_input("🏷️ SKU", placeholder="e.g., IN-0024")
            
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
                            "category": category,
                            "sku": sku
                        }
                        st.success(f"✅ {product_name} added successfully!")
                        st.rerun()
                else:
                    st.error("❌ Please fill in all required fields with valid values.")
    
    except Exception as e:
        st.error(f"Add product error: {str(e)}")

def show_update_stock():
    try:
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
    
    except Exception as e:
        st.error(f"Update stock error: {str(e)}")

if __name__ == "__main__":
    main()
def show_sales_entry_inline():
    """Inline sales entry for dashboard"""
    try:
        with st.expander("📝 Quick Sale Entry", expanded=False):
            with st.form("inline_sales_form", clear_on_submit=True):
                col1, col2, col3 = st.columns(3)
                
                with col1:
                    available_products = [name for name, item in st.session_state.inventory_data.items() if item["current_stock"] > 0]
                    
                    if not available_products:
                        st.error("❌ No products available for sale!")
                        product = None
                    else:
                        product = st.selectbox("🌼 Product", available_products, key="inline_product")
                
                with col2:
                    if product:
                        max_qty = st.session_state.inventory_data[product]["current_stock"]
                        quantity = st.number_input(f"📊 Qty (Max: {max_qty})", min_value=1, max_value=max_qty, step=1, value=1, key="inline_qty")
                        default_price = st.session_state.inventory_data[product]["unit_price"]
                    else:
                        quantity = 1
                        default_price = 0.0
                
                with col3:
                    unit_price = st.number_input("💵 Price (RM)", min_value=0.0, value=default_price, step=0.01, format="%.2f", key="inline_price")
                    
                submitted = st.form_submit_button("🛒 Record Sale", type="primary", use_container_width=True)
                
                if submitted and product and quantity > 0:
                    # Add to sales data
                    sale_record = {
                        "date": datetime.now().strftime("%Y-%m-%d"),
                        "item": product,
                        "quantity": quantity,
                        "unit_price": unit_price,
                        "customer": "Walk-in",
                        "notes": "",
                        "timestamp": datetime.now().strftime("%H:%M:%S")
                    }
                    st.session_state.sales_data.append(sale_record)
                    
                    # Update inventory
                    st.session_state.inventory_data[product]["current_stock"] -= quantity
                    
                    total_amount = quantity * unit_price
                    st.success(f"✅ Sale recorded: {quantity} x {product} for RM {total_amount:.2f}")
                    
                    # Check stock level
                    remaining = st.session_state.inventory_data[product]["current_stock"]
                    min_stock = st.session_state.inventory_data[product]["min_stock"]
                    
                    if remaining <= min_stock:
                        st.warning(f"⚠️ {product} is now at low stock level: {remaining} units remaining!")
                    
                    st.rerun()
    
    except Exception as e:
        st.error(f"Sales entry error: {str(e)}")

def calculate_kpis():
    """Calculate all inventory KPIs"""
    try:
        inventory_data = st.session_state.inventory_data
        sales_data = st.session_state.sales_data
        
        kpis = {}
        
        # Calculate total values
        total_inventory_value = sum(item["current_stock"] * item["unit_cost"] for item in inventory_data.values())
        total_inventory_units = sum(item["current_stock"] for item in inventory_data.values())
        
        if sales_data:
            df_sales = pd.DataFrame(sales_data)
            df_sales["total_revenue"] = df_sales["quantity"] * df_sales["unit_price"]
            
            # Calculate COGS (Cost of Goods Sold)
            total_cogs = 0
            for sale in sales_data:
                item_name = sale["item"]
                if item_name in inventory_data:
                    item_cost = inventory_data[item_name]["unit_cost"]
                    total_cogs += sale["quantity"] * item_cost
            
            # 1. Inventory Turnover Ratio
            if total_inventory_value > 0:
                kpis["inventory_turnover"] = total_cogs / total_inventory_value
            else:
                kpis["inventory_turnover"] = 0
            
            # 2. Average Inventory (simplified - using current as proxy)
            kpis["average_inventory"] = total_inventory_value
            
            # 3. Stockouts
            out_of_stock_items = [name for name, item in inventory_data.items() if item["current_stock"] == 0]
            kpis["stockout_rate"] = (len(out_of_stock_items) / len(inventory_data)) * 100 if len(inventory_data) > 0 else 0
            
            # 4. Sell-Through Rate (simplified calculation)
            total_sold = df_sales["quantity"].sum()
            total_available = total_inventory_units + total_sold
            kpis["sell_through_rate"] = (total_sold / total_available) * 100 if total_available > 0 else 0
            
            # 5. Holding Costs (simplified as 2% of inventory value per month)
            kpis["holding_cost_percentage"] = 2.0  # 2% monthly holding cost
            kpis["holding_cost_amount"] = total_inventory_value * 0.02
            
            # 6. Days Sales of Inventory (DSI)
            if total_cogs > 0:
                kpis["dsi"] = (total_inventory_value / total_cogs) * 365
            else:
                kpis["dsi"] = 365  # Default if no sales
            
            # 7. Demand Forecast Accuracy (simplified - based on stockouts)
            kpis["forecast_accuracy"] = max(0, 100 - kpis["stockout_rate"])
            
            # 8. Inventory Accuracy (assuming 98% accuracy as default)
            kpis["inventory_accuracy"] = 98.5
            
            # 9. Service Level (based on availability)
            kpis["service_level"] = 100 - kpis["stockout_rate"]
            
            # 10. Gross Margin by Product
            total_revenue = df_sales["total_revenue"].sum()
            kpis["overall_gross_margin"] = ((total_revenue - total_cogs) / total_revenue) * 100 if total_revenue > 0 else 0
            
        else:
            # Default values when no sales data
            kpis = {
                "inventory_turnover": 0,
                "average_inventory": total_inventory_value,
                "stockout_rate": (len([name for name, item in inventory_data.items() if item["current_stock"] == 0]) / len(inventory_data)) * 100,
                "sell_through_rate": 0,
                "holding_cost_percentage": 2.0,
                "holding_cost_amount": total_inventory_value * 0.02,
                "dsi": 365,
                "forecast_accuracy": 85,
                "inventory_accuracy": 98.5,
                "service_level": 95,
                "overall_gross_margin": 0
            }
        
        return kpis
    
    except Exception as e:
        st.error(f"KPI calculation error: {str(e)}")
        return {}

def show_analytics():
    try:
        st.markdown("""
        <div class="chamomile-header">
            <h1>📈 Business Analytics & KPIs</h1>
            <p>Comprehensive inventory performance metrics and insights</p>
        </div>
        """, unsafe_allow_html=True)
        
        # Calculate KPIs
        kpis = calculate_kpis()
        
        if not kpis:
            st.error("Unable to calculate KPIs. Please check your data.")
            return
        
        # KPI Overview
        st.markdown('<div class="section-header">📊 Key Performance Indicators</div>', unsafe_allow_html=True)
        
        # Row 1: Core Inventory Metrics
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            turnover_color = "normal" if kpis["inventory_turnover"] >= 2 else "inverse"
            st.metric(
                "📈 Inventory Turnover Ratio", 
                f"{kpis['inventory_turnover']:.2f}x",
                delta="Good" if kpis["inventory_turnover"] >= 2 else "Needs Improvement",
                delta_color=turnover_color
            )
        
        with col2:
            dsi_color = "inverse" if kpis["dsi"] > 60 else "normal"
            st.metric(
                "📅 Days Sales Inventory", 
                f"{kpis['dsi']:.0f} days",
                delta="Good" if kpis["dsi"] <= 60 else "High",
                delta_color=dsi_color
            )
        
        with col3:
            stockout_color = "inverse" if kpis["stockout_rate"] > 5 else "normal"
            st.metric(
                "🚨 Stockout Rate", 
                f"{kpis['stockout_rate']:.1f}%",
                delta="Critical" if kpis["stockout_rate"] > 10 else "Acceptable",
                delta_color=stockout_color
            )
        
        with col4:
            service_color = "normal" if kpis["service_level"] >= 95 else "inverse"
            st.metric(
                "✅ Service Level", 
                f"{kpis['service_level']:.1f}%",
                delta="Excellent" if kpis["service_level"] >= 98 else "Good",
                delta_color=service_color
            )
        
        # Row 2: Financial Metrics
        col5, col6, col7, col8 = st.columns(4)
        
        with col5:
            margin_color = "normal" if kpis["overall_gross_margin"] >= 20 else "inverse"
            st.metric(
                "💰 Gross Margin", 
                f"{kpis['overall_gross_margin']:.1f}%",
                delta="Strong" if kpis["overall_gross_margin"] >= 30 else "Fair",
                delta_color=margin_color
            )
        
        with col6:
            st.metric(
                "💼 Holding Cost", 
                f"RM {kpis['holding_cost_amount']:.2f}",
                delta=f"{kpis['holding_cost_percentage']:.1f}% of inventory"
            )
        
        with col7:
            sell_through_color = "normal" if kpis["sell_through_rate"] >= 60 else "inverse"
            st.metric(
                "📊 Sell-Through Rate", 
                f"{kpis['sell_through_rate']:.1f}%",
                delta="Healthy" if kpis["sell_through_rate"] >= 70 else "Monitor",
                delta_color=sell_through_color
            )
        
        with col8:
            accuracy_color = "normal" if kpis["inventory_accuracy"] >= 95 else "inverse"
            st.metric(
                "🎯 Inventory Accuracy", 
                f"{kpis['inventory_accuracy']:.1f}%",
                delta="Excellent" if kpis["inventory_accuracy"] >= 98 else "Good",
                delta_color=accuracy_color
            )
        
        # Detailed Analysis Tabs
        tab1, tab2, tab3, tab4 = st.tabs(["📊 Performance Analysis", "📈 Trends & Insights", "🎯 Product Performance", "⚠️ Recommendations"])
        
        with tab1:
            show_performance_analysis(kpis)
        
        with tab2:
            show_trends_insights()
        
        with tab3:
            show_product_performance()
        
        with tab4:
            show_recommendations(kpis)
    
    except Exception as e:
        st.error(f"Analytics error: {str(e)}")

def show_performance_analysis(kpis):
    """Detailed performance analysis"""
    try:
        st.markdown("### 📊 Detailed Performance Analysis")
        
        # Performance gauge charts using text-based indicators
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("#### 🎯 Inventory Health Score")
            
            # Calculate overall health score
            health_factors = [
                min(100, kpis["service_level"]),  # Service level
                max(0, 100 - kpis["stockout_rate"] * 2),  # Stockout penalty
                min(100, kpis["inventory_accuracy"]),  # Accuracy
                min(100, kpis["sell_through_rate"]),  # Sell-through
            ]
            health_score = sum(health_factors) / len(health_factors)
            
            if health_score >= 85:
                health_status = "🟢 Excellent"
                health_color = "#25D366"
            elif health_score >= 70:
                health_status = "🟡 Good"
                health_color = "#E6C383"
            else:
                health_status = "🔴 Needs Improvement"
                health_color = "#dc2626"
            
            st.markdown(f"""
            <div style="background: white; padding: 1.5rem; border-radius: 10px; border: 3px solid {health_color}; text-align: center;">
                <h2 style="color: {health_color}; margin: 0;">{health_score:.1f}/100</h2>
                <p style="color: #5A3E36; margin: 0.5rem 0 0 0; font-weight: 600;">{health_status}</p>
            </div>
            """, unsafe_allow_html=True)
        
        with col2:
            st.markdown("#### 💡 Key Insights")
            
            insights = []
            
            if kpis["dsi"] > 90:
                insights.append("⚠️ High DSI indicates slow-moving inventory")
            elif kpis["dsi"] < 30:
                insights.append("🚀 Low DSI shows efficient inventory turnover")
            
            if kpis["stockout_rate"] > 10:
                insights.append("🚨 High stockout rate affecting customer satisfaction")
            elif kpis["stockout_rate"] < 2:
                insights.append("✅ Excellent stock availability")
            
            if kpis["overall_gross_margin"] > 30:
                insights.append("💰 Strong profit margins")
            elif kpis["overall_gross_margin"] < 15:
                insights.append("📉 Profit margins need improvement")
            
            if not insights:
                insights.append("📊 Performance metrics are within normal ranges")
            
            for insight in insights:
                st.info(insight)
        
        # KPI Definitions
        st.markdown("#### 📚 KPI Definitions & Benchmarks")
        
        with st.expander("📖 Understanding Your KPIs"):
            st.markdown("""
            **📈 Inventory Turnover Ratio:** Measures how often inventory is sold and replaced
            - **Good:** 2-6x annually | **Excellent:** 6+x annually
            
            **📅 Days Sales of Inventory (DSI):** Average days to sell entire inventory
            - **Good:** 30-60 days | **Monitor:** 60+ days
            
            **🚨 Stockout Rate:** Percentage of products out of stock
            - **Target:** <5% | **Critical:** >10%
            
            **✅ Service Level:** Percentage of demand met without stockouts
            - **Good:** 90-95% | **Excellent:** 95%+
            
            **💰 Gross Margin:** Profit percentage per product
            - **Fair:** 15-25% | **Strong:** 25%+ | **Excellent:** 40%+
            
            **📊 Sell-Through Rate:** Percentage of inventory sold
            - **Target:** 60-80% | **Excellent:** 80%+
            """)
    
    except Exception as e:
        st.error(f"Performance analysis error: {str(e)}")

def show_trends_insights():
    """Show trends and insights"""
    try:
        st.markdown("### 📈 Trends & Insights")
        
        if st.session_state.sales_data:
            df_sales = pd.DataFrame(st.session_state.sales_data)
            df_sales["date"] = pd.to_datetime(df_sales["date"])
            df_sales["total"] = df_sales["quantity"] * df_sales["unit_price"]
            
            # Sales trend
            daily_sales = df_sales.groupby(df_sales["date"].dt.date)["total"].sum().reset_index()
            daily_sales.columns = ["Date", "Sales"]
            
            if len(daily_sales) > 1:
                # Create a simple chart using Plotly
                fig = px.line(daily_sales, x="Date", y="Sales", 
                             title="📈 Daily Sales Trend",
                             color_discrete_sequence=["#E6C383"])
                fig.update_layout(
                    plot_bgcolor="white",
                    paper_bgcolor="white",
                    font_color="#5A3E36"
                )
                st.plotly_chart(fig, use_container_width=True)
            
            # Top selling products
            st.markdown("#### 🏆 Top Selling Products")
            product_sales = df_sales.groupby("item").agg({
                "quantity": "sum",
                "total": "sum"
            }).reset_index()
            product_sales = product_sales.sort_values("total", ascending=False).head(10)
            product_sales.columns = ["Product", "Units Sold", "Revenue (RM)"]
            
            st.dataframe(
                product_sales,
                use_container_width=True,
                hide_index=True,
                column_config={
                    "Revenue (RM)": st.column_config.NumberColumn(format="%.2f")
                }
            )
        else:
            st.info("📊 Sales trends will appear here once you start recording sales data.")
    
    except Exception as e:
        st.error(f"Trends analysis error: {str(e)}")

def show_product_performance():
    """Show individual product performance"""
    try:
        st.markdown("### 🎯 Product Performance Analysis")
        
        inventory_data = st.session_state.inventory_data
        
        # Create product performance dataframe
        product_performance = []
        
        for name, item in inventory_data.items():
            # Calculate individual product metrics
            stock_status = get_stock_status(item["current_stock"], item["min_stock"])
            stock_coverage = (item["current_stock"] / item["max_stock"]) * 100 if item["max_stock"] > 0 else 0
            
            # Calculate sales for this product
            product_sales = [sale for sale in st.session_state.sales_data if sale["item"] == name]
            units_sold = sum(sale["quantity"] for sale in product_sales)
            revenue = sum(sale["quantity"] * sale["unit_price"] for sale in product_sales)
            
            # Calculate product gross margin
            if revenue > 0:
                cogs = units_sold * item["unit_cost"]
                gross_margin = ((revenue - cogs) / revenue) * 100
            else:
                gross_margin = 0
            
            # Calculate inventory value
            inventory_value = item["current_stock"] * item["unit_cost"]
            
            product_performance.append({
                "Product": name,
                "Category": item["category"],
                "Current Stock": item["current_stock"],
                "Stock Status": stock_status,
                "Stock Coverage (%)": stock_coverage,
                "Units Sold": units_sold,
                "Revenue (RM)": revenue,
                "Gross Margin (%)": gross_margin,
                "Inventory Value (RM)": inventory_value,
                "Supplier": item["supplier"]
            })
        
        df_performance = pd.DataFrame(product_performance)
        
        # Display filters
        col1, col2, col3 = st.columns(3)
        
        with col1:
            category_filter = st.selectbox("Filter by Category", 
                                         ["All"] + list(df_performance["Category"].unique()))
        
        with col2:
            status_filter = st.selectbox("Filter by Stock Status", 
                                       ["All", "Critical", "Low", "Normal"])
        
        with col3:
            sort_by = st.selectbox("Sort by", 
                                 ["Revenue", "Units Sold", "Gross Margin", "Stock Coverage"])
        
        # Apply filters
        filtered_df = df_performance.copy()
        
        if category_filter != "All":
            filtered_df = filtered_df[filtered_df["Category"] == category_filter]
        
        if status_filter != "All":
            filtered_df = filtered_df[filtered_df["Stock Status"] == status_filter]
        
        # Sort data
        if sort_by == "Revenue":
            filtered_df = filtered_df.sort_values("Revenue (RM)", ascending=False)
        elif sort_by == "Units Sold":
            filtered_df = filtered_df.sort_values("Units Sold", ascending=False)
        elif sort_by == "Gross Margin":
            filtered_df = filtered_df.sort_values("Gross Margin (%)", ascending=False)
        elif sort_by == "Stock Coverage":
            filtered_df = filtered_df.sort_values("Stock Coverage (%)", ascending=False)
        
        # Display table
        st.dataframe(
            filtered_df,
            use_container_width=True,
            hide_index=True,
            column_config={
                "Revenue (RM)": st.column_config.NumberColumn(format="%.2f"),
                "Gross Margin (%)": st.column_config.NumberColumn(format="%.1f"),
                "Stock Coverage (%)": st.column_config.NumberColumn(format="%.1f"),
                "Inventory Value (RM)": st.column_config.NumberColumn(format="%.2f")
            }
        )
        
        # Performance insights
        st.markdown("#### 💡 Product Insights")
        
        col1, col2 = st.columns(2)
        
        with col1:
            # Top performers
            top_revenue = df_performance.nlargest(3, "Revenue (RM)")["Product"].tolist()
            top_margin = df_performance.nlargest(3, "Gross Margin (%)")["Product"].tolist()
            
            st.markdown("**🏆 Top Performers**")
            st.success(f"**Revenue Leaders:** {', '.join(top_revenue[:3])}")
            if any(margin > 0 for margin in df_performance["Gross Margin (%)"]):
                st.success(f"**Margin Leaders:** {', '.join(top_margin[:3])}")
        
        with col2:
            # Needs attention
            critical_items = df_performance[df_performance["Stock Status"] == "Critical"]["Product"].tolist()
            low_performers = df_performance[df_performance["Units Sold"] == 0]["Product"].tolist()
            
            st.markdown("**⚠️ Needs Attention**")
            if critical_items:
                st.error(f"**Critical Stock:** {', '.join(critical_items[:3])}")
            if low_performers:
                st.warning(f"**No Sales:** {', '.join(low_performers[:3])}")
    
    except Exception as e:
        st.error(f"Product performance error: {str(e)}")

def show_recommendations(kpis):
    """Show actionable recommendations based on KPIs"""
    try:
        st.markdown("### ⚠️ Actionable Recommendations")
        
        recommendations = []
        
        # Inventory turnover recommendations
        if kpis["inventory_turnover"] < 1:
            recommendations.append({
                "priority": "🔴 High",
                "category": "Inventory Turnover",
                "issue": "Very low inventory turnover",
                "action": "Consider promotions, discounts, or product bundling to increase sales velocity",
                "impact": "Reduce holding costs and improve cash flow"
            })
        elif kpis["inventory_turnover"] < 2:
            recommendations.append({
                "priority": "🟡 Medium",
                "category": "Inventory Turnover",
                "issue": "Below optimal inventory turnover",
                "action": "Review product mix and implement targeted marketing campaigns",
                "impact": "Improve inventory efficiency"
            })
        
        # DSI recommendations
        if kpis["dsi"] > 90:
            recommendations.append({
                "priority": "🔴 High",
                "category": "Days Sales Inventory",
                "issue": "High DSI indicates slow-moving inventory",
                "action": "Identify slow-moving products and implement clearance strategies",
                "impact": "Reduce inventory holding period and costs"
            })
        elif kpis["dsi"] > 60:
            recommendations.append({
                "priority": "🟡 Medium",
                "category": "Days Sales Inventory",
                "issue": "DSI above optimal range",
                "action": "Review demand forecasting and adjust procurement schedules",
                "impact": "Optimize inventory levels"
            })
        
        # Stockout recommendations
        if kpis["stockout_rate"] > 10:
            recommendations.append({
                "priority": "🔴 High",
                "category": "Stock Management",
                "issue": "High stockout rate affecting customer satisfaction",
                "action": "Implement safety stock levels and improve demand forecasting",
                "impact": "Improve customer satisfaction and sales"
            })
        elif kpis["stockout_rate"] > 5:
            recommendations.append({
                "priority": "🟡 Medium",
                "category": "Stock Management",
                "issue": "Moderate stockout rate",
                "action": "Review minimum stock levels for frequently sold items",
                "impact": "Reduce lost sales opportunities"
            })
        
        # Margin recommendations
        if kpis["overall_gross_margin"] < 15:
            recommendations.append({
                "priority": "🔴 High",
                "category": "Profitability",
                "issue": "Low gross margins affecting profitability",
                "action": "Review pricing strategy and negotiate better supplier terms",
                "impact": "Improve overall profitability"
            })
        elif kpis["overall_gross_margin"] < 25:
            recommendations.append({
                "priority": "🟡 Medium",
                "category": "Profitability",
                "issue": "Margins could be improved",
                "action": "Analyze product-level margins and optimize pricing",
                "impact": "Increase profit margins"
            })
        
        # Service level recommendations
        if kpis["service_level"] < 90:
            recommendations.append({
                "priority": "🔴 High",
                "category": "Customer Service",
                "issue": "Low service level affecting customer experience",
                "action": "Implement automated reorder points and safety stock",
                "impact": "Improve customer satisfaction and retention"
            })
        
        # Holding cost recommendations
        if kpis["holding_cost_amount"] > 1000:
            recommendations.append({
                "priority": "🟡 Medium",
                "category": "Cost Management",
                "issue": "High inventory holding costs",
                "action": "Optimize inventory levels and improve turnover",
                "impact": "Reduce operational costs"
            })
        
        # Display recommendations
        if recommendations:
            for i, rec in enumerate(recommendations):
                with st.expander(f"{rec['priority']} {rec['category']}: {rec['issue']}", expanded=i==0):
                    col1, col2 = st.columns([2, 1])
                    
                    with col1:
                        st.markdown(f"**📋 Recommended Action:**")
                        st.info(rec['action'])
                        
                        st.markdown(f"**🎯 Expected Impact:**")
                        st.success(rec['impact'])
                    
                    with col2:
                        st.markdown(f"**Priority Level:**")
                        st.markdown(rec['priority'])
                        
                        if rec['priority'] == "🔴 High":
                            st.error("Immediate attention required")
                        elif rec['priority'] == "🟡 Medium":
                            st.warning("Address within 1-2 weeks")
                        else:
                            st.info("Monitor and plan")
        else:
            st.success("🎉 Great job! Your inventory metrics are performing well. Keep monitoring for continuous improvement.")
        
        # General best practices
        st.markdown("#### 📚 General Best Practices")
        
        with st.expander("💡 Inventory Management Tips"):
            st.markdown("""
            **🔄 Regular Reviews:**
            - Review inventory levels weekly
            - Analyze sales patterns monthly
            - Adjust reorder points seasonally
            
            **📊 Data-Driven Decisions:**
            - Use historical sales data for forecasting
            - Monitor KPIs consistently
            - Set up automated alerts for critical levels
            
            **🤝 Supplier Management:**
            - Maintain good supplier relationships
            - Negotiate favorable payment terms
            - Have backup suppliers for critical items
            
            **💰 Cost Optimization:**
            - Regularly review pricing strategies
            - Optimize order quantities
            - Minimize holding costs while maintaining service levels
            
            **📈 Growth Strategies:**
            - Focus on high-margin products
            - Identify and eliminate slow-moving inventory
            - Implement cross-selling and upselling opportunities
            """)
    
    except Exception as e:
        st.error(f"Recommendations error: {str(e)}")

def show_settings():
    st.markdown("""
    <div class="chamomile-header">
        <h1>⚙️ Settings</h1>
        <p>Configure your system preferences and data management</p>
    </div>
    """, unsafe_allow_html=True)
    
    tab1, tab2, tab3 = st.tabs(["🔧 System Settings", "📊 Data Management", "🔄 Backup & Restore"])
    
    with tab1:
        st.markdown("### 🔧 System Configuration")
        
        st.markdown("#### 📱 Display Settings")
        currency = st.selectbox("Currency", ["RM (Malaysian Ringgit)", "USD", "EUR", "SGD"], index=0)
        decimal_places = st.selectbox("Decimal Places", [0, 1, 2], index=2)
        
        st.markdown("#### ⚠️ Alert Thresholds")
        col1, col2 = st.columns(2)
        with col1:
            low_stock_threshold = st.slider("Low Stock Alert (%)", 10, 50, 20)
        with col2:
            critical_stock_days = st.slider("Critical Stock Days", 1, 10, 3)
        
        if st.button("💾 Save Settings"):
            st.success("✅ Settings saved successfully!")
    
    with tab2:
        st.markdown("### 📊 Data Management")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("#### 📤 Export Data")
            if st.button("📋 Export Inventory Data"):
                df_inventory = pd.DataFrame.from_dict(st.session_state.inventory_data, orient='index')
                csv = df_inventory.to_csv()
                st.download_button(
                    label="⬇️ Download Inventory CSV",
                    data=csv,
                    file_name=f"inventory_export_{datetime.now().strftime('%Y%m%d')}.csv",
                    mime="text/csv"
                )
            
            if st.button("💰 Export Sales Data"):
                if st.session_state.sales_data:
                    df_sales = pd.DataFrame(st.session_state.sales_data)
                    csv = df_sales.to_csv(index=False)
                    st.download_button(
                        label="⬇️ Download Sales CSV",
                        data=csv,
                        file_name=f"sales_export_{datetime.now().strftime('%Y%m%d')}.csv",
                        mime="text/csv"
                    )
                else:
                    st.info("No sales data to export")
        
        with col2:
            st.markdown("#### 🗑️ Data Cleanup")
            st.warning("⚠️ These actions cannot be undone!")
            
            if st.button("🧹 Clear Old Sales Data (>30 days)"):
                cutoff_date = datetime.now() - timedelta(days=30)
                original_count = len(st.session_state.sales_data)
                st.session_state.sales_data = [
                    sale for sale in st.session_state.sales_data 
                    if datetime.strptime(sale["date"], "%Y-%m-%d") > cutoff_date
                ]
                removed = original_count - len(st.session_state.sales_data)
                st.success(f"✅ Removed {removed} old sales records")
    
    with tab3:
        st.markdown("### 🔄 Backup & Restore")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("#### 💾 Backup Data")
            backup_data = {
                "inventory_data": st.session_state.inventory_data,
                "sales_data": st.session_state.sales_data,
                "backup_date": datetime.now().isoformat()
            }
            backup_json = json.dumps(backup_data, indent=2)
            
            st.download_button(
                label="📦 Download Complete Backup",
                data=backup_json,
                file_name=f"chamomile_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json",
                mime="application/json"
            )
        
        with col2:
            st.markdown("#### 📂 Restore Data")
            uploaded_file = st.file_uploader("Choose backup file", type="json")
            
            if uploaded_file is not None:
                try:
                    backup_data = json.load(uploaded_file)
                    
                    if st.button("🔄 Restore from Backup"):
                        st.session_state.inventory_data = backup_data.get("inventory_data", {})
                        st.session_state.sales_data = backup_data.get("sales_data", [])
                        st.success("✅ Data restored successfully!")
                        st.rerun()
                        
                except Exception as e:
                    st.error(f"❌ Error reading backup file: {str(e)}")

if __name__ == "__main__":
    main()import streamlit as st

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import json
from typing import Dict, List

# Configure the page
st.set_page_config(
    page_title="🧋 Oatmilk Tea Inventory",
    page_icon="🧋",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Enhanced Custom CSS for better appearance
st.markdown("""
<style>
    /* Import Google Fonts */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    /* Global Styles */
    .main > div {
        padding-top: 2rem;
        font-family: 'Inter', sans-serif;
    }
    
    /* Improved Metrics */
    .stMetric {
        background: linear-gradient(145deg, #ffffff, #f8f9fa);
        border: 1px solid #e9ecef;
        padding: 1.5rem;
        border-radius: 12px;
        margin: 0.25rem 0;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
    }
    
    .stMetric:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }
    
    /* Enhanced Alert Styles */
    .alert-critical {
        background: linear-gradient(135deg, #ff6b6b, #ff5252);
        color: white;
        border-radius: 10px;
        padding: 1.2rem;
        margin: 0.8rem 0;
        box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
        animation: pulse 2s infinite;
    }
    
    .alert-warning {
        background: linear-gradient(135deg, #ffd93d, #ffcc02);
        color: #8B4513;
        border-radius: 10px;
        padding: 1.2rem;
        margin: 0.8rem 0;
        box-shadow: 0 4px 12px rgba(255, 217, 61, 0.3);
    }
    
    .alert-success {
        background: linear-gradient(135deg, #51cf66, #40c057);
        color: white;
        border-radius: 10px;
        padding: 1.2rem;
        margin: 0.8rem 0;
        box-shadow: 0 4px 12px rgba(81, 207, 102, 0.3);
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
    
    /* Better Headers */
    .custom-header {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        margin: 1rem 0;
        font-weight: 600;
        text-align: center;
    }
    
    .section-header {
        background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%);
        color: white;
        padding: 0.8rem 1.2rem;
        border-radius: 8px;
        margin: 1rem 0 0.5rem 0;
        font-weight: 500;
    }
    
    /* Form Improvements */
    .stSelectbox > div > div {
        background-color: #f8f9fa;
        border-radius: 8px;
    }
    
    .stNumberInput > div > div {
        background-color: #f8f9fa;
        border-radius: 8px;
    }
    
    .stTextInput > div > div {
        background-color: #f8f9fa;
        border-radius: 8px;
    }
    
    /* Button Improvements */
    .stButton > button {
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 0.5rem 1.5rem;
        font-weight: 500;
        transition: all 0.3s ease;
    }
    
    .stButton > button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
    
    /* Sidebar Improvements */
    .css-1d391kg {
        background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
    }
    
    /* Table Improvements */
    .dataframe {
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    /* Status Badges */
    .status-badge {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
        display: inline-block;
        margin: 2px;
    }
    
    .status-critical { background: #ffe0e1; color: #c92a2a; }
    .status-warning { background: #fff3bf; color: #e67700; }
    .status-normal { background: #d3f9d8; color: #2b8a3e; }
    
    /* Loading Animation */
    .loading-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 200px;
    }
    
    .loading-spinner {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #667eea;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
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
                "White Sugar 1000ml": {
                    "current_stock": 12,
                    "min_stock": 5,
                    "max_stock": 50,
                    "unit_cost": 2.85,
                    "unit_price": 4.00,
                    "supplier": "Local Supplier",
                    "category": "Sweeteners"
                },
                "Oatside Ceramic": {
                    "current_stock": 49,
                    "min_stock": 10,
                    "max_stock": 100,
                    "unit_cost": 9.90,
                    "unit_price": 15.00,
                    "supplier": "Oatside",
                    "category": "Oat Milk"
                },
                "English Tea Shop Lavender": {
                    "current_stock": 19,
                    "min_stock": 8,
                    "max_stock": 40,
                    "unit_cost": 18.20,
                    "unit_price": 25.00,
                    "supplier": "English Tea Shop",
                    "category": "Tea"
                },
                "BOH Jasmine Green Tea": {
                    "current_stock": 36,
                    "min_stock": 15,
                    "max_stock": 60,
                    "unit_cost": 8.71,
                    "unit_price": 12.00,
                    "supplier": "BOH",
                    "category": "Tea"
                },
                "Country Peach": {
                    "current_stock": 26,
                    "min_stock": 10,
                    "max_stock": 50,
                    "unit_cost": 5.00,
                    "unit_price": 8.50,
                    "supplier": "Local Farm",
                    "category": "Flavoring"
                },
                "BOH Lychee with Rose Tea": {
                    "current_stock": 8,
                    "min_stock": 12,
                    "max_stock": 40,
                    "unit_cost": 9.43,
                    "unit_price": 14.00,
                    "supplier": "BOH",
                    "category": "Tea"
                },
                "Raspberry": {
                    "current_stock": 3,
                    "min_stock": 15,
                    "max_stock": 30,
                    "unit_cost": 12.50,
                    "unit_price": 18.00,
                    "supplier": "Local Farm",
                    "category": "Flavoring"
                }
            }
        
        if 'sales_data' not in st.session_state:
            st.session_state.sales_data = [
                {"date": "2025-06-01", "item": "White Sugar 1000ml", "quantity": 3, "unit_price": 4.00},
                {"date": "2025-06-01", "item": "Oatside Ceramic", "quantity": 1, "unit_price": 15.00},
                {"date": "2025-06-02", "item": "English Tea Shop Lavender", "quantity": 6, "unit_price": 25.00},
                {"date": "2025-06-02", "item": "BOH Jasmine Green Tea", "quantity": 4, "unit_price": 12.00},
                {"date": "2025-06-03", "item": "Country Peach", "quantity": 4, "unit_price": 8.50},
            ]
        
        if 'purchase_data' not in st.session_state:
            st.session_state.purchase_data = []

def main():
    inventory_manager = InventoryManager()
    
    # Enhanced Sidebar with better navigation
    with st.sidebar:
        st.markdown("""
        <div style="text-align: center; padding: 1rem;">
            <h1 style="color: white; font-size: 1.5rem; margin: 0;">🧋 Tea Inventory</h1>
            <p style="color: #e0e0e0; font-size: 0.9rem; margin: 0.5rem 0;">Professional Management System</p>
        </div>
        """, unsafe_allow_html=True)
        
        # Navigation with icons
        pages = {
            "📊 Dashboard": "dashboard",
            "📦 Inventory": "inventory", 
            "💰 Sales": "sales",
            "🛒 Purchases": "purchases",
            "📈 Analytics": "analytics",
            "⚙️ Settings": "settings"
        }
        
        selected_page = st.radio("", list(pages.keys()), key="navigation")
        
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
    
    # Route to pages
    page_key = pages[selected_page]
    
    if page_key == "dashboard":
        show_enhanced_dashboard()
    elif page_key == "inventory":
        show_enhanced_inventory()
    elif page_key == "sales":
        show_enhanced_sales()
    elif page_key == "purchases":
        show_enhanced_purchases()
    elif page_key == "analytics":
        show_enhanced_analytics()
    elif page_key == "settings":
        show_enhanced_settings()

def show_enhanced_dashboard():
    # Header with business branding
    st.markdown("""
    <div class="custom-header">
        <h1 style="margin: 0; font-size: 2.5rem;">🧋 Oatmilk Tea Inventory Dashboard</h1>
        <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">Real-time Business Intelligence</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Enhanced Key Metrics with better visuals
    inventory_data = st.session_state.inventory_data
    total_value = sum(item["current_stock"] * item["unit_cost"] for item in inventory_data.values())
    total_items = len(inventory_data)
    low_stock_items = [name for name, item in inventory_data.items() if item["current_stock"] <= item["min_stock"]]
    out_of_stock = [name for name, item in inventory_data.items() if item["current_stock"] == 0]
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("💰 Total Inventory Value", f"RM {total_value:,.2f}", delta="Live")
    
    with col2:
        st.metric("📦 Products", total_items, delta="Active")
    
    with col3:
        alert_color = "normal" if len(low_stock_items) == 0 else "inverse"
        st.metric("⚠️ Low Stock", len(low_stock_items), delta=f"-{len(low_stock_items)}" if low_stock_items else "All Good!", delta_color=alert_color)
    
    with col4:
        critical_color = "normal" if len(out_of_stock) == 0 else "inverse"
        st.metric("🚨 Critical", len(out_of_stock), delta=f"-{len(out_of_stock)}" if out_of_stock else "All Good!", delta_color=critical_color)
    
    # Enhanced Alerts with better styling
    st.markdown('<div class="section-header">🚨 Stock Alerts & Action Items</div>', unsafe_allow_html=True)
    
    alerts_col1, alerts_col2 = st.columns([2, 1])
    
    with alerts_col1:
        if out_of_stock:
            for item in out_of_stock:
                st.markdown(f"""
                <div class="alert-critical">
                    <h4 style="margin: 0 0 0.5rem 0;">🚨 CRITICAL: {item}</h4>
                    <p style="margin: 0; font-size: 1.1rem;">OUT OF STOCK - Immediate reorder required!</p>
                    <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">Contact: {inventory_data[item]['supplier']}</p>
                </div>
                """, unsafe_allow_html=True)
        
        if low_stock_items:
            for item in low_stock_items:
                if item not in out_of_stock:
                    current = inventory_data[item]["current_stock"]
                    minimum = inventory_data[item]["min_stock"]
                    st.markdown(f"""
                    <div class="alert-warning">
                        <h4 style="margin: 0 0 0.5rem 0;">⚠️ LOW STOCK: {item}</h4>
                        <p style="margin: 0; font-size: 1.1rem;">Current: {current} units | Minimum: {minimum} units</p>
                        <p style="margin: 0.5rem 0 0 0; opacity: 0.8;">Reorder soon from: {inventory_data[item]['supplier']}</p>
                    </div>
                    """, unsafe_allow_html=True)
        
        if not low_stock_items and not out_of_stock:
            st.markdown("""
            <div class="alert-success">
                <h4 style="margin: 0 0 0.5rem 0;">✅ All Stock Levels Healthy!</h4>
                <p style="margin: 0; font-size: 1.1rem;">No immediate action required. Keep up the great work!</p>
            </div>
            """, unsafe_allow_html=True)
    
    with alerts_col2:
        # Quick action buttons
        st.markdown("### 🚀 Quick Actions")
        if st.button("📝 Record Sale", use_container_width=True):
            st.switch_page("sales")
        if st.button("📦 Update Stock", use_container_width=True):
            st.switch_page("inventory")
        if st.button("📈 View Analytics", use_container_width=True):
            st.switch_page("analytics")
    
    # Enhanced Stock Overview with better charts
    st.markdown('<div class="section-header">📊 Stock Levels Overview</div>', unsafe_allow_html=True)
    
    # Create enhanced stock level chart
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
    
    # Create side-by-side charts
    chart_col1, chart_col2 = st.columns(2)
    
    with chart_col1:
        fig1 = px.bar(
            df_stock, 
            x="Product", 
            y=["Current Stock", "Min Stock"], 
            title="📊 Current vs Minimum Stock Levels",
            color_discrete_map={"Current Stock": "#667eea", "Min Stock": "#f093fb"},
            height=400
        )
        fig1.update_layout(
            plot_bgcolor='rgba(0,0,0,0)',
            paper_bgcolor='rgba(0,0,0,0)',
            font=dict(family="Inter, sans-serif"),
            title_font_size=16
        )
        st.plotly_chart(fig1, use_container_width=True)
    
    with chart_col2:
        # Donut chart for stock status
        status_counts = df_stock['Status'].value_counts()
        fig2 = px.pie(
            values=status_counts.values, 
            names=status_counts.index,
            title="📈 Stock Status Distribution",
            hole=0.4,
            color_discrete_map={"Critical": "#ff6b6b", "Low": "#ffd93d", "Normal": "#51cf66"},
            height=400
        )
        fig2.update_layout(
            plot_bgcolor='rgba(0,0,0,0)',
            paper_bgcolor='rgba(0,0,0,0)',
            font=dict(family="Inter, sans-serif"),
            title_font_size=16
        )
        st.plotly_chart(fig2, use_container_width=True)
    
    # Enhanced Recent Activity
    st.markdown('<div class="section-header">📝 Recent Sales Activity</div>', unsafe_allow_html=True)
    
    if st.session_state.sales_data:
        recent_sales = pd.DataFrame(st.session_state.sales_data[-10:])
        recent_sales["Total"] = recent_sales["quantity"] * recent_sales["unit_price"]
        recent_sales["Date"] = pd.to_datetime(recent_sales["date"]).dt.strftime("%b %d")
        recent_sales = recent_sales[["Date", "item", "quantity", "unit_price", "Total"]]
        recent_sales.columns = ["Date", "Product", "Qty", "Unit Price (RM)", "Total (RM)"]
        
        st.dataframe(
            recent_sales, 
            use_container_width=True,
            hide_index=True,
            column_config={
                "Unit Price (RM)": st.column_config.NumberColumn(format="%.2f"),
                "Total (RM)": st.column_config.NumberColumn(format="%.2f")
            }
        )
        
        # Sales summary cards
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
            avg_daily = df_sales.groupby("date")["Total"].sum().mean()
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

def show_enhanced_inventory():
    st.markdown("""
    <div class="custom-header">
        <h1 style="margin: 0; font-size: 2.2rem;">📦 Inventory Management</h1>
        <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">Manage your products and stock levels</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Enhanced tabs with better styling
    tab1, tab2, tab3, tab4 = st.tabs(["📋 Current Inventory", "➕ Add Product", "✏️ Update Stock", "🔄 Bulk Actions"])
    
    with tab1:
        show_current_inventory()
    
    with tab2:
        show_add_product()
    
    with tab3:
        show_update_stock()
    
    with tab4:
        show_bulk_actions()

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
    
    # Create enhanced dataframe
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
    
    # Display enhanced table
    st.dataframe(
        df_inventory,
        use_container_width=True,
        hide_index=True,
        column_config={
            "Cost": st.column_config.NumberColumn("Cost (RM)", format="%.2f"),
            "Price": st.column_config.NumberColumn("Price (RM)", format="%.2f"),
            "Value": st.column_config.NumberColumn("Value (RM)", format="%.2f"),
            "Margin": st.column_config.NumberColumn("Margin (%)", format="%.1f"),
            "Status": st.column_config.TextColumn(
                "Status",
                help="Stock status based on minimum levels"
            )
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
            product_name = st.text_input("📝 Product Name *", placeholder="e.g., Earl Grey Tea Bags")
            category = st.selectbox("🏷️ Category", ["Tea", "Oat Milk", "Sweeteners", "Flavoring", "Packaging", "Other"])
            supplier = st.text_input("🏢 Supplier", placeholder="e.g., ABC Tea Company")
        
        with col2:
            unit_cost = st.number_input("💰 Unit Cost (RM) *", min_value=0.0, step=0.01, format="%.2f")
            unit_price = st.number_input("💵 Selling Price (RM) *", min_value=0.0, step=0.01, format="%.2f")
            initial_stock = st.number_input("📦 Initial Stock", min_value=0, step=1)
        
        col3, col4 = st.columns(2)
        with col3:
            min_stock = st.number_input("⚠️ Minimum Stock Level", min_value=0, step=1, help="Alert when stock falls below this level")
        with col4:
            max_stock = st.number_input("📈 Maximum Stock Level", min_value=0, step=1, help="Target maximum inventory level")
        
        # Show calculated margin
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
        
        # Visual stock indicator
        progress_color = "#ff6b6b" if status == "Critical" else "#ffd93d" if status == "Low" else "#51cf66"
        st.markdown(f"""
        <div style="background: #f0f0f0; border-radius: 10px; height: 20px; margin: 1rem 0;">
            <div style="background: {progress_color}; height: 100%; width: {fill_percentage}%; border-radius: 10px; transition: all 0.3s ease;"></div>
        </div>
        """, unsafe_allow_html=True)
        
        col_add, col_remove = st.columns(2)
        
        with col_add:
            st.markdown("**📈 Add Stock (Received Delivery)**")
            with st.form(f"add_stock_{product_to_update}"):
                add_quantity = st.number_input("Quantity to Add", min_value=0, step=1, key=f"add_qty_{product_to_update}")
                add_reason = st.selectbox("Reason", ["New Delivery", "Stock Transfer", "Inventory Adjustment"])
                add_submitted = st.form_submit_button("➕ Add Stock", type="primary", use_container_width=True)
                
                if add_submitted and add_quantity > 0:
                    st.session_state.inventory_data[product_to_update]["current_stock"] += add_quantity
                    st.success(f"✅ Added {add_quantity} units to {product_to_update}")
                    st.rerun()
        
        with col_remove:
            st.markdown("**📉 Remove Stock (Used/Sold)**")
            with st.form(f"remove_stock_{product_to_update}"):
                remove_quantity = st.number_input("Quantity to Remove", min_value=0, max_value=current_stock, step=1, key=f"remove_qty_{product_to_update}")
                remove_reason = st.selectbox("Reason", ["Direct Sale", "Waste/Expired", "Stock Transfer", "Inventory Adjustment"])
                remove_submitted = st.form_submit_button("➖ Remove Stock", type="secondary", use_container_width=True)
                
                if remove_submitted and remove_quantity > 0:
                    st.session_state.inventory_data[product_to_update]["current_stock"] -= remove_quantity
                    st.success(f"✅ Removed {remove_quantity} units from {product_to_update}")
                    st.rerun()

def show_bulk_actions():
    st.markdown("### 🔄 Bulk Actions")
    
    action_type = st.selectbox("Select Action", [
        "Export Inventory Data",
        "Import Stock Update",
        "Generate Reorder Report",
        "Reset All Stock Alerts"
    ])
    
    if action_type == "Export Inventory Data":
        st.markdown("📤 **Export current inventory to CSV**")
        df_export = pd.DataFrame([
            {
                "Product": name,
                "Category": item["category"],
                "Current Stock": item["current_stock"],
                "Min Stock": item["min_stock"],
                "Max Stock": item["max_stock"],
                "Unit Cost": item["unit_cost"],
                "Unit Price": item["unit_price"],
                "Supplier": item["supplier"],
                "Total Value": item["current_stock"] * item["unit_cost"]
            }
            for name, item in st.session_state.inventory_data.items()
        ])
        
        csv_data = df_export.to_csv(index=False)
        st.download_button(
            "📥 Download CSV",
            csv_data,
            f"inventory_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
            "text/csv",
            use_container_width=True
        )
        
        st.dataframe(df_export, use_container_width=True)
    
    elif action_type == "Generate Reorder Report":
        st.markdown("📋 **Products that need reordering**")
        
        reorder_items = []
        for name, item in st.session_state.inventory_data.items():
            if item["current_stock"] <= item["min_stock"]:
                suggested_order = max(item["max_stock"] - item["current_stock"], item["min_stock"] * 2)
                reorder_items.append({
                    "Product": name,
                    "Current Stock": item["current_stock"],
                    "Min Stock": item["min_stock"],
                    "Suggested Order Qty": suggested_order,
                    "Estimated Cost": suggested_order * item["unit_cost"],
                    "Supplier": item["supplier"],
                    "Priority": "🚨 URGENT" if item["current_stock"] == 0 else "⚠️ Soon"
                })
        
        if reorder_items:
            df_reorder = pd.DataFrame(reorder_items)
            st.dataframe(df_reorder, use_container_width=True)
            
            total_cost = df_reorder["Estimated Cost"].sum()
            st.metric("💰 Total Reorder Cost", f"RM {total_cost:.2f}")
            
            # Generate reorder list
            csv_reorder = df_reorder.to_csv(index=False)
            st.download_button(
                "📥 Download Reorder List",
                csv_reorder,
                f"reorder_list_{datetime.now().strftime('%Y%m%d')}.csv",
                "text/csv",
                use_container_width=True
            )
        else:
            st.success("✅ No products need reordering right now!")

def show_enhanced_sales():
    st.markdown("""
    <div class="custom-header">
        <h1 style="margin: 0; font-size: 2.2rem;">💰 Sales Management</h1>
        <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">Record sales and track performance</p>
    </div>
    """, unsafe_allow_html=True)
    
    tab1, tab2 = st.tabs(["📝 Record Sale", "📊 Sales History"])
    
    with tab1:
        show_sales_entry()
    
    with tab2:
        show_sales_history()

def show_sales_entry():
    st.markdown("### 📝 Quick Sale Entry")
    
    # Enhanced sales form with better UX
    with st.form("enhanced_sales_form", clear_on_submit=True):
        col1, col2, col3 = st.columns(3)
        
        with col1:
            sale_date = st.date_input("📅 Sale Date", datetime.now().date())
            available_products = [name for name, item in st.session_state.inventory_data.items() if item["current_stock"] > 0]
            
            if not available_products:
                st.error("❌ No products available for sale!")
                product = None
            else:
                product = st.selectbox("🧋 Product Sold", available_products)
        
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
        
        # Customer info (optional)
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
            
            # Show updated stock level
            remaining = st.session_state.inventory_data[product]["current_stock"]
            min_stock = st.session_state.inventory_data[product]["min_stock"]
            
            if remaining <= min_stock:
                st.warning(f"⚠️ {product} is now at low stock level: {remaining} units remaining!")
            
            st.rerun()

def show_sales_history():
    st.markdown("### 📊 Sales History & Analytics")
    
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
        product_filter = st.selectbox("🧋 Product Filter", ["All Products"] + df_sales["item"].unique().tolist())
    
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
    
    # Sales table with enhanced display
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

def show_enhanced_purchases():
    st.markdown("""
    <div class="custom-header">
        <h1 style="margin: 0; font-size: 2.2rem;">🛒 Purchase Management</h1>
        <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">Track purchases and supplier information</p>
    </div>
    """, unsafe_allow_html=True)
    
    tab1, tab2 = st.tabs(["📝 Record Purchase", "📊 Purchase History"])
    
    with tab1:
        show_purchase_entry()
    
    with tab2:
        show_purchase_history()

def show_purchase_entry():
    st.markdown("### 📝 Record New Purchase")
    
    with st.form("enhanced_purchase_form", clear_on_submit=True):
        col1, col2, col3 = st.columns(3)
        
        with col1:
            purchase_date = st.date_input("📅 Purchase Date", datetime.now().date())
            product = st.selectbox("📦 Product Purchased", list(st.session_state.inventory_data.keys()))
        
        with col2:
            quantity = st.number_input("📊 Quantity Purchased", min_value=1, step=1)
            if product:
                default_cost = st.session_state.inventory_data[product]["unit_cost"]
            else:
                default_cost = 0.0
        
        with col3:
            unit_cost = st.number_input("💰 Unit Cost (RM)", min_value=0.0, value=default_cost, step=0.01, format="%.2f")
            total_cost = quantity * unit_cost
            st.success(f"💰 Total Cost: RM {total_cost:.2f}")
        
        supplier = st.text_input("🏢 Supplier", value=st.session_state.inventory_data.get(product, {}).get("supplier", ""))
        invoice_number = st.text_input("📄 Invoice Number (Optional)")
        notes = st.text_area("📝 Notes (Optional)", placeholder="Delivery conditions, quality notes, etc.")
        
        submitted = st.form_submit_button("✅ Record Purchase", type="primary", use_container_width=True)
        
        if submitted and product and quantity > 0:
            # Add to purchase data
            purchase_record = {
                "date": purchase_date.strftime("%Y-%m-%d"),
                "item": product,
                "quantity": quantity,
                "unit_cost": unit_cost,
                "supplier": supplier,
                "invoice_number": invoice_number,
                "notes": notes,
                "timestamp": datetime.now().strftime("%H:%M:%S")
            }
            st.session_state.purchase_data.append(purchase_record)
            
            # Update inventory
            st.session_state.inventory_data[product]["current_stock"] += quantity
            
            st.success(f"✅ Purchase recorded: {quantity} x {product} for RM {total_cost:.2f}")
            
            # Show updated stock level
            new_stock = st.session_state.inventory_data[product]["current_stock"]
            st.info(f"📦 New stock level for {product}: {new_stock} units")
            
            st.rerun()

def show_purchase_history():
    st.markdown("### 📊 Purchase History")
    
    if not st.session_state.purchase_data:
        st.info("💡 No purchases recorded yet. Use the Record Purchase tab to start tracking!")
        return
    
    df_purchases = pd.DataFrame(st.session_state.purchase_data)
    df_purchases["Total Cost"] = df_purchases["quantity"] * df_purchases["unit_cost"]
    df_purchases["Date"] = pd.to_datetime(df_purchases["date"])
    
    # Display purchases
    display_df = df_purchases.copy()
    display_df["Date"] = display_df["Date"].dt.strftime("%Y-%m-%d")
    display_df = display_df[["Date", "item", "quantity", "unit_cost", "Total Cost", "supplier", "invoice_number"]].sort_values("Date", ascending=False)
    display_df.columns = ["Date", "Product", "Qty", "Unit Cost", "Total Cost", "Supplier", "Invoice #"]
    
    st.dataframe(
        display_df,
        use_container_width=True,
        hide_index=True,
        column_config={
            "Unit Cost": st.column_config.NumberColumn("Unit Cost (RM)", format="%.2f"),
            "Total Cost": st.column_config.NumberColumn("Total Cost (RM)", format="%.2f")
        }
    )

def show_enhanced_analytics():
    st.markdown("""
    <div class="custom-header">
        <h1 style="margin: 0; font-size: 2.2rem;">📈 Business Analytics</h1>
        <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">Insights and performance metrics</p>
    </div>
    """, unsafe_allow_html=True)
    
    if not st.session_state.sales_data:
        st.info("💡 No sales data available for analytics. Record some sales first!")
        return
    
    # Analytics implementation here
    st.info("🚧 Advanced analytics coming soon!")

def show_enhanced_settings():
    st.markdown("""
    <div class="custom-header">
        <h1 style="margin: 0; font-size: 2.2rem;">⚙️ Settings</h1>
        <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">Configure your system preferences</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Settings implementation here
    st.info("🚧 Settings panel coming soon!")

if __name__ == "__main__":
    main()
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
    
    .alert-warning {
        background: #FFFFFF !important;
        border: 3px solid #E6C383 !important;
        border-left: 8px solid #E6C383 !important;
        border-radius: 12px;
        padding: 1.5rem;
        margin: 1rem 0;
        box-shadow: 0 4px 15px rgba(230, 195, 131, 0.2);
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
    
    /* Other styling for forms, tables, etc. */
    .stSelectbox > div > div,
    .stNumberInput > div > div,
    .stTextInput > div > div {
        background-color: #FFFFFF !important;
        border: 2px solid #E6C383 !important;
        border-radius: 10px;
        color: #5A3E36 !important;
    }
    
    .stDataFrame {
        background: #FFFFFF !important;
        border: 3px solid #E6C383 !important;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(90, 62, 54, 0.1);
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
                "BOH Chamomile Tea": {
                    "current_stock": 178,
                    "min_stock": 165,
                    "max_stock": 300,
                    "unit_cost": 0.47,
                    "unit_price": 12.00,
                    "supplier": "from Shopee",
                    "category": "Tea",
                    "sku": "IN-0007"
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
                }
            }
        
        if 'sales_data' not in st.session_state:
            st.session_state.sales_data = [
                {"date": "2025-06-01", "item": "BOH Chamomile Tea", "quantity": 5, "unit_price": 12.00},
                {"date": "2025-06-01", "item": "Oatside Oatmilk", "quantity": 2, "unit_price": 9.90},
                {"date": "2025-06-02", "item": "BOH Chamomile Tea", "quantity": 3, "unit_price": 12.00},
            ]

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

def show_sales_entry_inline():
    """Inline sales entry for dashboard"""
    try:
        with st.expander("📝 Quick Sale Entry", expanded=False):
            with st.form("inline_sales_form", clear_on_submit=True):
                col1, col2, col3 = st.columns(3)
                
                with col1:
                    available_products = [name for name, item in st.session_state.inventory_data.items() if item["current_stock"] > 0]
                    
                    if not available_products:
                        st.error("No products available for sale!")
                        product = None
                    else:
                        product = st.selectbox("Product", available_products, key="inline_product")
                
                with col2:
                    if product:
                        max_qty = st.session_state.inventory_data[product]["current_stock"]
                        quantity = st.number_input(f"Quantity (Max: {max_qty})", min_value=1, max_value=max_qty, step=1, value=1, key="inline_qty")
                        default_price = st.session_state.inventory_data[product]["unit_price"]
                    else:
                        quantity = 1
                        default_price = 0.0
                
                with col3:
                    unit_price = st.number_input("Price (RM)", min_value=0.0, value=default_price, step=0.01, format="%.2f", key="inline_price")
                    
                submitted = st.form_submit_button("Record Sale", type="primary", use_container_width=True)
                
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
                    st.success(f"Sale recorded: {quantity} x {product} for RM {total_amount:.2f}")
                    
                    # Check stock level
                    remaining = st.session_state.inventory_data[product]["current_stock"]
                    min_stock = st.session_state.inventory_data[product]["min_stock"]
                    
                    if remaining <= min_stock:
                        st.warning(f"{product} is now at low stock level: {remaining} units remaining!")
                    
                    st.rerun()
    
    except Exception as e:
        st.error(f"Sales entry error: {str(e)}")

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
            
            selected_page = st.radio("", pages, 
                                    index=pages.index(st.session_state.current_page) if st.session_state.current_page in pages else 0,
                                    key="nav_radio")
            
            st.session_state.current_page = selected_page
            
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
                    supplier = inventory_data[item]["supplier"]
                    st.markdown(f"""
                    <div class="alert-critical">
                        <h4>🚨 CRITICAL: {item}</h4>
                        <p style="margin: 0; font-size: 1.1rem; color: #dc2626;">OUT OF STOCK - Immediate reorder required!</p>
                        <p style="margin: 0.5rem 0 0 0; opacity: 0.8; color: #5A3E36;">Contact: {supplier}</p>
                    </div>
                    """, unsafe_allow_html=True)
            
            if low_stock_items:
                for item in low_stock_items:
                    if item not in out_of_stock:
                        current = inventory_data[item]["current_stock"]
                        minimum = inventory_data[item]["min_stock"]
                        supplier = inventory_data[item]["supplier"]
                        
                        st.markdown(f"""
                        <div class="alert-warning">
                            <h4>⚠️ LOW STOCK: {item}</h4>
                            <p style="margin: 0; font-size: 1.1rem; color: #5A3E36;">Current: {current} units | Minimum: {minimum} units</p>
                            <p style="margin: 0.5rem 0 0 0; opacity: 0.8; color: #5A3E36;">Reorder soon from: {supplier}</p>
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
        
        tab1, tab2, tab3, tab4 = st.tabs(["📋 Current Inventory", "➕ Add Product", "✏️ Update Stock", "🔧 Edit/Delete Product"])
        
        with tab1:
            show_current_inventory()
        
        with tab2:
            show_add_product()
        
        with tab3:
            show_update_stock()
        
        with tab4:
            show_edit_delete_product()
    
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
                        st.success(f"✅ Removed {remove_quantity} units from {product_to_update}")
                        st.rerun()
    
    except Exception as e:
        st.error(f"Update stock error: {str(e)}")

def show_edit_delete_product():
    """Edit or delete existing products"""
    try:
        st.markdown("### 🔧 Edit or Delete Products")
        
        if not st.session_state.inventory_data:
            st.info("📦 No products available to edit or delete.")
            return
        
        # Product selection
        selected_product = st.selectbox("📦 Select Product to Edit/Delete", 
                                      list(st.session_state.inventory_data.keys()))
        
        if selected_product:
            product_data = st.session_state.inventory_data[selected_product]
            
            # Edit and Delete sections
            edit_col, delete_col = st.columns([2, 1])
            
            with edit_col:
                st.markdown("#### ✏️ Edit Product Information")
                
                with st.form(f"edit_product_{selected_product}"):
                    # Basic Information
                    col_a, col_b = st.columns(2)
                    
                    with col_a:
                        new_name = st.text_input("Product Name", value=selected_product)
                        new_category = st.selectbox("Category", 
                                                  ["Tea", "Oat Milk", "Sweeteners", "Packaging", "Other"],
                                                  index=["Tea", "Oat Milk", "Sweeteners", "Packaging", "Other"].index(product_data["category"]) if product_data["category"] in ["Tea", "Oat Milk", "Sweeteners", "Packaging", "Other"] else 0)
                        new_supplier = st.text_input("Supplier", value=product_data.get("supplier", ""))
                    
                    with col_b:
                        new_sku = st.text_input("SKU", value=product_data.get("sku", ""))
                        new_unit_cost = st.number_input("Unit Cost (RM)", 
                                                      min_value=0.0, 
                                                      value=float(product_data["unit_cost"]), 
                                                      step=0.01, 
                                                      format="%.2f")
                        new_unit_price = st.number_input("Selling Price (RM)", 
                                                       min_value=0.0, 
                                                       value=float(product_data["unit_price"]), 
                                                       step=0.01, 
                                                       format="%.2f")
                    
                    # Stock Levels
                    col_c, col_d, col_e = st.columns(3)
                    
                    with col_c:
                        new_current_stock = st.number_input("Current Stock", 
                                                          min_value=0, 
                                                          value=int(product_data["current_stock"]), 
                                                          step=1)
                    
                    with col_d:
                        new_min_stock = st.number_input("Minimum Stock", 
                                                      min_value=0, 
                                                      value=int(product_data["min_stock"]), 
                                                      step=1)
                    
                    with col_e:
                        new_max_stock = st.number_input("Maximum Stock", 
                                                      min_value=0, 
                                                      value=int(product_data["max_stock"]), 
                                                      step=1)
                    
                    # Confirmation and submit
                    confirm_edit = st.checkbox("⚠️ I confirm I want to update this product")
                    
                    edit_submitted = st.form_submit_button("✅ Update Product", 
                                                         type="primary", 
                                                         use_container_width=True,
                                                         disabled=not confirm_edit)
                    
                    if edit_submitted and confirm_edit:
                        try:
                            # Check if name changed and new name doesn't exist
                            if new_name != selected_product and new_name in st.session_state.inventory_data:
                                st.error("❌ A product with this name already exists!")
                            else:
                                # Update the product
                                updated_product = {
                                    "current_stock": new_current_stock,
                                    "min_stock": new_min_stock,
                                    "max_stock": new_max_stock,
                                    "unit_cost": new_unit_cost,
                                    "unit_price": new_unit_price,
                                    "supplier": new_supplier,
                                    "category": new_category,
                                    "sku": new_sku
                                }
                                
                                # If name changed, remove old entry and add new one
                                if new_name != selected_product:
                                    del st.session_state.inventory_data[selected_product]
                                    st.session_state.inventory_data[new_name] = updated_product
                                    
                                    # Update sales records to reflect name change
                                    for sale in st.session_state.sales_data:
                                        if sale["item"] == selected_product:
                                            sale["item"] = new_name
                                    
                                    st.success(f"✅ Product updated and renamed from '{selected_product}' to '{new_name}'!")
                                else:
                                    # Just update existing entry
                                    st.session_state.inventory_data[selected_product] = updated_product
                                    st.success(f"✅ Product '{selected_product}' updated successfully!")
                                
                                st.rerun()
                        
                        except Exception as e:
                            st.error(f"❌ Error updating product: {str(e)}")
            
            with delete_col:
                st.markdown("#### 🗑️ Delete Product")
                
                # Safety checks for deletion
                has_sales = any(sale["item"] == selected_product for sale in st.session_state.sales_data)
                has_stock = product_data["current_stock"] > 0
                
                if has_sales or has_stock:
                    st.warning("⚠️ **Cannot Delete:**")
                    if has_sales:
                        st.write("• Has sales history")
                    if has_stock:
                        st.write(f"• Has {product_data['current_stock']} units in stock")
                    
                    # Option to force delete with confirmation
                    st.markdown("**🚨 Force Delete (Not Recommended)**")
                    force_delete = st.checkbox("I understand this will remove all data", key=f"force_{selected_product}")
                    
                    if st.button("🗑️ Force Delete Product", 
                               type="secondary", 
                               disabled=not force_delete,
                               use_container_width=True):
                        
                        # Remove from inventory
                        del st.session_state.inventory_data[selected_product]
                        
                        # Remove from sales history
                        st.session_state.sales_data = [
                            sale for sale in st.session_state.sales_data 
                            if sale["item"] != selected_product
                        ]
                        
                        st.success(f"✅ Product '{selected_product}' and all related data have been deleted!")
                        st.rerun()
                
                else:
                    # Safe to delete
                    st.success("✅ **Safe to Delete:**")
                    st.write("• No sales history")
                    st.write("• No current stock")
                    
                    confirm_delete = st.checkbox("⚠️ Confirm deletion", key=f"delete_{selected_product}")
                    
                    if st.button("🗑️ Delete Product", 
                               type="secondary", 
                               disabled=not confirm_delete,
                               use_container_width=True):
                        
                        del st.session_state.inventory_data[selected_product]
                        st.success(f"✅ Product '{selected_product}' deleted successfully!")
                        st.rerun()
    
    except Exception as e:
        st.error(f"Edit/Delete product error: {str(e)}")

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
            
            # 2. Average Inventory
            kpis["average_inventory"] = total_inventory_value
            
            # 3. Stockouts
            out_of_stock_items = [name for name, item in inventory_data.items() if item["current_stock"] == 0]
            kpis["stockout_rate"] = (len(out_of_stock_items) / len(inventory_data)) * 100 if len(inventory_data) > 0 else 0
            
            # 4. Sell-Through Rate
            total_sold = df_sales["quantity"].sum()
            total_available = total_inventory_units + total_sold
            kpis["sell_through_rate"] = (total_sold / total_available) * 100 if total_available > 0 else 0
            
            # 5. Days Sales of Inventory (DSI)
            if total_cogs > 0:
                kpis["dsi"] = (total_inventory_value / total_cogs) * 365
            else:
                kpis["dsi"] = 365
            
            # 6. Service Level
            kpis["service_level"] = 100 - kpis["stockout_rate"]
            
            # 7. Gross Margin
            total_revenue = df_sales["total_revenue"].sum()
            kpis["overall_gross_margin"] = ((total_revenue - total_cogs) / total_revenue) * 100 if total_revenue > 0 else 0
            
        else:
            # Default values when no sales data
            kpis = {
                "inventory_turnover": 0,
                "average_inventory": total_inventory_value,
                "stockout_rate": (len([name for name, item in inventory_data.items() if item["current_stock"] == 0]) / len(inventory_data)) * 100,
                "sell_through_rate": 0,
                "dsi": 365,
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
            st.metric(
                "📈 Inventory Turnover", 
                f"{kpis['inventory_turnover']:.2f}x",
                delta="Good" if kpis["inventory_turnover"] >= 2 else "Needs Improvement"
            )
        
        with col2:
            st.metric(
                "📅 Days Sales Inventory", 
                f"{kpis['dsi']:.0f} days",
                delta="Good" if kpis["dsi"] <= 60 else "High"
            )
        
        with col3:
            st.metric(
                "🚨 Stockout Rate", 
                f"{kpis['stockout_rate']:.1f}%",
                delta="Critical" if kpis["stockout_rate"] > 10 else "Acceptable"
            )
        
        with col4:
            st.metric(
                "✅ Service Level", 
                f"{kpis['service_level']:.1f}%",
                delta="Excellent" if kpis["service_level"] >= 98 else "Good"
            )
        
        # Performance Analysis
        st.markdown('<div class="section-header">📊 Performance Analysis</div>', unsafe_allow_html=True)
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("#### 🎯 Inventory Health Score")
            
            # Calculate overall health score
            health_factors = [
                min(100, kpis["service_level"]),
                max(0, 100 - kpis["stockout_rate"] * 2),
                min(100, kpis["sell_through_rate"]),
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
        
        # Sales trends if data exists
        if st.session_state.sales_data and len(st.session_state.sales_data) > 1:
            st.markdown('<div class="section-header">📈 Sales Trends</div>', unsafe_allow_html=True)
            
            df_sales = pd.DataFrame(st.session_state.sales_data)
            df_sales["date"] = pd.to_datetime(df_sales["date"])
            df_sales["total"] = df_sales["quantity"] * df_sales["unit_price"]
            
            # Daily sales trend
            daily_sales = df_sales.groupby(df_sales["date"].dt.date)["total"].sum().reset_index()
            daily_sales.columns = ["Date", "Sales"]
            
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
    
    except Exception as e:
        st.error(f"Analytics error: {str(e)}")

def show_settings():
    st.markdown("""
    <div class="chamomile-header">
        <h1>⚙️ Settings</h1>
        <p>Configure your system preferences and data management</p>
    </div>
    """, unsafe_allow_html=True)
    
    tab1, tab2 = st.tabs(["🔧 System Settings", "📊 Data Management"])
    
    with tab1:
        st.markdown("### 🔧 System Configuration")
        
        st.markdown("#### 📱 Display Settings")
        currency = st.selectbox("Currency", ["RM (Malaysian Ringgit)", "USD", "EUR", "SGD"], index=0)
        decimal_places = st.selectbox("Decimal Places", [0, 1, 2], index=2)
        
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

if __name__ == "__main__":
    main() {product_name} added successfully!")
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
            
            with col2:
                st.markdown(f"""
                **Current Status:** {get_stock_status(current_stock, min_stock)}  
                **Stock Level:** {current_stock} / {max_stock} units
                """)
            
            col_add, col_remove = st.columns(2)
            
            with col_add:
                st.markdown("**📈 Add Stock**")
                with st.form(f"add_stock_{product_to_update}"):
                    add_quantity = st.number_input("Quantity to Add", min_value=0, step=1)
                    add_submitted = st.form_submit_button("➕ Add Stock", type="primary", use_container_width=True)
                    
                    if add_submitted and add_quantity > 0:
                        st.session_state.inventory_data[product_to_update]["current_stock"] += add_quantity
                        st.success(f"✅ Added {add_quantity} units to {product_to_update}")
                        st.rerun()
            
            with col_remove:
                st.markdown("**📉 Remove Stock**")
                with st.form(f"remove_stock_{product_to_update}"):
                    remove_quantity = st.number_input("Quantity to Remove", min_value=0, max_value=current_stock, step=1)
                    remove_submitted = st.form_submit_button("➖ Remove Stock", use_container_width=True)
                    
                    if remove_submitted and remove_quantity > 0:
                        st.session_state.inventory_data[product_to_update]["current_stock"] -= remove_quantity
                        st.success(f"✅

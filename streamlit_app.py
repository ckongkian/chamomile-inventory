# Chamomile Inventory Management App (Streamlit-based)

# Main entrypoint
if __name__ == "__main__":
    main()

# ---------- Initialization ----------

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import json
from typing import Dict, List

# Page Config
st.set_page_config(
    page_title="🌼 Chamomile Tea Inventory",
    page_icon="🌼",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Load Custom Styles (CSS)
st.markdown(open("custom_style.css").read(), unsafe_allow_html=True)

# ---------- Inventory Manager Class ----------
class InventoryManager:
    def __init__(self):
        self.load_data()

    def load_data(self):
        if "inventory_data" not in st.session_state:
            st.session_state.inventory_data = self._initial_inventory()
        if "sales_data" not in st.session_state:
            st.session_state.sales_data = self._initial_sales()
        if "purchase_data" not in st.session_state:
            st.session_state.purchase_data = []

    def _initial_inventory(self):
        # Return initial inventory structure (truncated for brevity)
        return {
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
            # More products here...
        }

    def _initial_sales(self):
        return [
            {"date": "2025-06-01", "item": "BOH Chamomile Tea", "quantity": 5, "unit_price": 12.00},
            # More sales entries here...
        ]

# ---------- KPI Utility Function ----------
def calculate_kpis():
    # Logic to calculate KPIs (abbreviated)
    # Includes inventory turnover, DSI, gross margin, etc.
    pass

# ---------- Utility Functions ----------
def get_stock_status(current, minimum):
    if current == 0:
        return "Critical"
    elif current <= minimum:
        return "Low"
    return "Normal"

# ---------- Pages ----------
def main():
    try:
        inventory_manager = InventoryManager()

        with st.sidebar:
            render_sidebar()

        # Route to page
        page = st.session_state.current_page
        if page == "📊 Dashboard":
            show_dashboard()
        elif page == "📦 Inventory":
            show_inventory()
        elif page == "📈 Analytics":
            show_analytics()
        elif page == "⚙️ Settings":
            show_settings()
    except Exception as e:
        st.error(f"Application error: {str(e)}")

# ---------- Sidebar ----------
def render_sidebar():
    st.markdown("""
        <div style="text-align: center; padding: 1.5rem;">
            <h1 style="color: #5A3E36; font-size: 1.8rem; margin: 0; font-family: 'Playfair Display', serif;">🌼 CHÁMOMILE</h1>
            <p style="color: #5A3E36; font-size: 0.9rem; margin: 0.5rem 0; font-style: italic;">Relaxation in every sip</p>
            <p style="color: #5A3E36; font-size: 0.8rem; margin: 0;">Professional Inventory System</p>
        </div>
    """, unsafe_allow_html=True)

    pages = ["\ud83d\udcca Dashboard", "\ud83d\udce6 Inventory", "\ud83d\udcc8 Analytics", "\u2699\ufe0f Settings"]
    if "current_page" not in st.session_state:
        st.session_state.current_page = pages[0]

    selected_page = st.radio("", pages, index=pages.index(st.session_state.current_page))
    st.session_state.current_page = selected_page

    st.markdown("---")
    inventory_data = st.session_state.inventory_data
    total_value = sum(item["current_stock"] * item["unit_cost"] for item in inventory_data.values())
    low_stock_count = len([item for item in inventory_data.values() if item["current_stock"] <= item["min_stock"]])

    st.markdown("### \ud83d\udcca Quick Stats")
    st.metric("\ud83d\udcb0 Total Value", f"RM {total_value:,.0f}")
    st.metric("\u26a0\ufe0f Alerts", low_stock_count)
    st.markdown("---")
    now = datetime.now()
    st.markdown(f"**\ud83d\uddd5\ufe0f {now.strftime('%B %d, %Y')}**")
    st.markdown(f"**\ud83d\udd50 {now.strftime('%I:%M %p')}**")

# Remaining pages (dashboard, inventory, analytics, settings) and their sub-functions
# can be moved to separate modules or continue in this file for simplicity.

# Example placeholder for one of the pages
def show_dashboard():
    st.header("Chamomile Dashboard")
    # Include logic here...

# Repeat similar placeholders for:
# - show_inventory()
# - show_analytics()
# - show_settings()

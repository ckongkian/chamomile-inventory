# 🍃 Chamomile Oatmilk Tea Inventory System

A comprehensive inventory management system designed specifically for Chamomile Oatmilk Tea business in Kota Kinabalu, Malaysia. This system manages two distinct business models: Event Planning (SULAP/JAM events) and Daily Distribution operations.

## 🚀 Live Demo

[Visit the live system](https://your-netlify-app.netlify.app) (Replace with your actual Netlify URL)

## ✨ Features

### 📊 Dual Business Model Support
- **Event Planning Business**: Manage inventory for SULAP & JAM events (2-4 days duration)
- **Distribution Business**: Daily operations focused on Sun-Kissed Peach product

### 🏪 Product Management
- **6 Premium Tea Products**:
  - 💜 Lavender Lullaby (Lavender & Chamomile)
  - 🌼 Gentle Chamomile (Chamomile)
  - 🌹 Lychee Rosette (Lychee & Rose)
  - 🍑 Sun-Kissed Peach (Peach & Orange Peel & Rosehips)
  - 🌙 Moonlit Jasmine (Jasmine Green Tea)
  - 🫐 Blushing Berry (Raspberry, Hibiscus & Rosehips)

### 📈 Smart Analytics
- Historical sales data analysis
- Intelligent quantity recommendations
- Performance tracking across different event types
- Real-time capacity utilization monitoring

### 🛡️ Safety & Quality Control
- Batch tracking with unique IDs
- 7-day shelf life management
- FIFO (First In, First Out) rotation
- Expiration date monitoring and alerts

### 📋 Export & Integration
- Google Sheets integration
- CSV export for inventory, sales history, and forecasting
- Backup and restore functionality

## 📁 Project Structure

```
tea-inventory-system/
├── index.html          # Main HTML structure with navigation
├── styles.css          # All CSS styles and responsive design
├── data.js             # Product definitions, sales history, inventory data
├── utils.js            # Utility functions and helpers
├── dashboard.js        # Dashboard functionality and metrics
├── inventory.js        # Inventory management and batch tracking
├── events.js           # Event planning and recommendations
├── distribution.js     # Distribution management
├── databank.js         # Historical data management
├── settings.js         # Settings and configuration
├── main.js             # Main application controller
└── README.md           # This documentation
```

## 🔧 Setup Instructions

### Prerequisites
- Git installed on your computer
- GitHub account
- Netlify account (free)

### 1. Create GitHub Repository

1. **Login to GitHub** and create a new repository:
   - Repository name: `tea-inventory-system`
   - Description: `Inventory management system for Chamomile Oatmilk Tea business`
   - Set to **Public** (required for free Netlify deployment)
   - ✅ Add README file
   - Choose MIT License

2. **Clone the repository** to your local machine:
   ```bash
   git clone https://github.com/yourusername/tea-inventory-system.git
   cd tea-inventory-system
   ```

### 2. Add Project Files

1. **Copy all the project files** into your local repository folder:
   - `index.html`
   - `styles.css`
   - `data.js`
   - `utils.js`
   - `dashboard.js`
   - `inventory.js`
   - `events.js`
   - `distribution.js`
   - `databank.js`
   - `settings.js`
   - `main.js`

2. **Commit and push** the files:
   ```bash
   git add .
   git commit -m "Initial commit: Add Tea Inventory System"
   git push origin main
   ```

### 3. Deploy to Netlify

#### Option A: Direct GitHub Connection (Recommended)

1. **Login to Netlify** (https://netlify.com)

2. **Click "New site from Git"**

3. **Connect to GitHub** and authorize Netlify

4. **Choose your repository**: `tea-inventory-system`

5. **Configure build settings**:
   - Build command: (leave empty)
   - Publish directory: (leave empty - will use root)
   - Click "Deploy site"

6. **Custom domain** (optional):
   - Go to Site settings > Domain management
   - Add custom domain or use the provided `.netlify.app` subdomain

#### Option B: Manual Deploy

1. **Download your repository** as a ZIP file from GitHub

2. **Login to Netlify**

3. **Drag and drop** the folder into the Netlify deploy area

4. **Your site is live!**

### 4. Post-Deployment Setup

1. **Test all functionality**:
   - Navigate through all tabs
   - Test inventory management
   - Verify data export features
   - Check responsive design on mobile

2. **Update README** with your live URL:
   ```markdown
   ## 🚀 Live Demo
   [Visit the live system](https://your-actual-site.netlify.app)
   ```

3. **Commit the README update**:
   ```bash
   git add README.md
   git commit -m "Update README with live demo URL"
   git push origin main
   ```

## 🎯 Quick Start Guide

### First Time Setup

1. **Open the system** in your web browser
2. **Welcome tour** will guide you through the main features
3. **Start with Dashboard** to see the overview
4. **Configure Settings** to match your business needs:
   - Set daily brewing capacities
   - Adjust shelf life settings
   - Configure distribution channels

### Daily Workflow

#### For Event Planning:
1. Go to **Event Planning** tab
2. Select event type and duration
3. Review recommended quantities
4. Select products for the event
5. Plan brewing schedule

#### For Distribution:
1. Go to **Distribution** tab
2. Check current stock levels
3. Plan daily production
4. Monitor channel allocation
5. Record daily sales

### Data Management:
1. **Data Bank** tab to view/edit historical sales
2. **Export data** to Google Sheets for backup
3. **Settings** tab for system configuration

## 🔄 Updates and Maintenance

### Updating the System

1. **Make changes** to your local files
2. **Test thoroughly** in your browser
3. **Commit changes**:
   ```bash
   git add .
   git commit -m "Describe your changes"
   git push origin main
   ```
4. **Netlify auto-deploys** from GitHub (if connected)

### Data Backup

- Use the **Settings** tab to export all data
- Save backup files to Google Drive or local storage
- Export data weekly for safety

## 📱 Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- 📱 Mobile responsive design

## 🛟 Troubleshooting

### Common Issues

**Problem**: Page loads but shows errors
- **Solution**: Check browser console (F12) for error messages
- Clear browser cache and reload

**Problem**: Data export not working
- **Solution**: Ensure pop-ups are allowed in browser settings

**Problem**: Mobile display issues
- **Solution**: System is responsive - try refreshing or clearing cache

**Problem**: Settings not saving
- **Solution**: Changes are saved automatically - check Settings tab for current values

### Getting Help

1. **Check browser console** (F12) for error messages
2. **Try in incognito/private mode** to test without cache
3. **Verify all files are uploaded** correctly to your repository
4. **Test on different browsers**

## 🔒 Security Notes

- This is a **client-side application** - all data is stored in the browser
- **No sensitive data** should be stored in the system
- **Regular backups** are recommended
- For production use, consider adding **authentication** and **server-side storage**

## 📊 System Specifications

- **Technology**: Vanilla JavaScript, HTML5, CSS3
- **Framework**: TailwindCSS for styling
- **Charts**: Chart.js for data visualization
- **Icons**: Lucide icons
- **Storage**: Browser localStorage (client-side)
- **Performance**: Optimized for fast loading
- **File Size**: ~50KB total (lightweight)

## 🎨 Customization

### Branding
- Edit `styles.css` to change colors and fonts
- Update company name in `index.html`
- Modify product icons and descriptions in `data.js`

### Business Logic
- Adjust capacity limits in `settings.js`
- Modify shelf life settings in `data.js`
- Update recommendation algorithms in `utils.js`

## 📄 License

MIT License - feel free to modify and use for your business needs.

## 🙏 Support

This system was designed specifically for Chamomile Oatmilk Tea business. For questions or support, please create an issue in the GitHub repository.

---

**Happy inventory management! 🍃📊**
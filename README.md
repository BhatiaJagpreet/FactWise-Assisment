# Enterprise Dashboard

A production-ready enterprise dashboard built with Next.js, AG Grid, and modern React patterns. This dashboard displays data in a scalable, performant grid that can handle 10k+ rows efficiently.

## 🚀 Features

### Core Functionality
- **AG Grid Integration**: Full-featured data grid with client-side row model
- **Data Management**: Add, Edit, and Delete rows with form validation
- **Real-time Updates**: Instant UI updates with optimistic state management
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### AG Grid Features
- ✅ **Sorting**: Multi-column sorting with visual indicators
- ✅ **Filtering**: Column filters (text, number, date, set) + quick search
- ✅ **Pagination**: Configurable page sizes (10, 20, 50, 100)
- ✅ **Column Resizing**: Drag to resize columns
- ✅ **Column Pinning**: Pin key columns (ID, Name) to left side
- ✅ **Row Selection**: Single and multi-select with checkboxes
- ✅ **Row Highlighting**: Hover effects and selected row styling
- ✅ **Custom Cell Renderers**:
  - Status badges with color coding
  - Progress bars for score visualization
  - Action buttons for Edit/Delete
- ✅ **Export to CSV**: One-click export functionality
- ✅ **Column Visibility**: Show/hide columns dynamically
- ✅ **Reset Filters**: Clear all filters and reset column state

### UI/UX Features
- **Modern Design**: Clean, professional enterprise theme
- **Smooth Animations**: Framer Motion animations for premium feel
- **Loading States**: Skeleton loaders and loading overlays
- **Error Handling**: Graceful error states with retry functionality
- **Toast Notifications**: Success/error feedback using Sonner
- **Row Details Panel**: Side panel showing selected row details
- **Summary Cards**: Key metrics at a glance

### Form Validation
- **React Hook Form**: Performant form handling
- **Zod Schema Validation**: Type-safe validation
- **Real-time Validation**: Instant feedback on form errors

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.4 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Data Grid**: AG Grid Community (client-side)
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Notifications**: Sonner
- **Linting**: ESLint + Prettier

## 📦 Installation

1. **Clone the repository** (or navigate to the project directory)

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main dashboard page
│   └── globals.css         # Global styles + AG Grid theme
├── components/
│   ├── Navbar.tsx          # Top navigation bar
│   ├── Sidebar.tsx         # Side navigation menu
│   ├── SummaryCard.tsx     # Metric summary cards
│   ├── DataGrid.tsx        # Main AG Grid component
│   ├── RowFormModal.tsx    # Add/Edit row modal
│   ├── DeleteConfirmModal.tsx  # Delete confirmation modal
│   └── RowDetailsPanel.tsx # Selected row details panel
├── data/
│   └── sample-data.json    # Sample dataset (20 rows)
├── lib/
│   └── formatters.ts       # Utility functions (formatting, calculations)
└── types/
    └── dashboard.ts        # TypeScript type definitions
```

## 📊 Sample Data

The dashboard comes with a sample dataset of 20 rows containing:
- User information (ID, Name, Email)
- Status (Active, Inactive, Blocked, Pending)
- Performance metrics (Score, Revenue, Projects)
- Department and date information

Data is stored in `src/data/sample-data.json` and can be easily replaced with your own dataset.

## 🎨 Customization

### Styling
- **Theme Colors**: Modify Tailwind classes in components
- **AG Grid Theme**: Customize in `globals.css` using CSS variables
- **Animations**: Adjust Framer Motion props in components

### Data Structure
Update the `DashboardRow` interface in `src/types/dashboard.ts` to match your data schema, then update:
- Column definitions in `DataGrid.tsx`
- Form schema in `RowFormModal.tsx`
- Sample data in `sample-data.json`

## ⚡ Performance & Scalability

### Optimizations for 10k+ Rows

1. **Client-Side Row Model**: AG Grid's client-side model efficiently handles large datasets
2. **Memoization**: 
   - `useMemo` for column definitions and row data
   - `useCallback` for event handlers
3. **Virtual Scrolling**: AG Grid automatically virtualizes rows for performance
4. **Pagination**: Default 10 rows per page reduces initial render
5. **Lazy Rendering**: Only visible rows are rendered

### Best Practices Implemented
- ✅ React hooks optimized to prevent unnecessary re-renders
- ✅ Column definitions memoized
- ✅ Event handlers wrapped in `useCallback`
- ✅ Efficient state management
- ✅ Minimal prop drilling

## 🔧 Configuration

### AG Grid Settings
- **Row Model**: Client-side (default)
- **Pagination**: Enabled (10 rows default)
- **Selection**: Multiple rows with checkboxes
- **Theme**: Quartz (customizable)

### Form Validation
- Email validation
- Required field checks
- Number range validation (score: 0-100)
- Date format validation

## 📝 Usage

### Adding a New Row
1. Click the "Add New Row" button in the top right
2. Fill in the form fields
3. Click "Add Row" to save

### Editing a Row
1. Click "Edit" in the Actions column or select a row
2. Modify the fields in the modal
3. Click "Save Changes"

### Deleting a Row
1. Click "Delete" in the Actions column
2. Confirm deletion in the modal

### Filtering Data
- Use column filters in the header
- Use the quick search box for global filtering
- Click "Reset Filters" to clear all filters

### Exporting Data
- Click "Export CSV" to download the current filtered/sorted data

## 🐛 Error Handling

The dashboard includes comprehensive error handling:
- **Data Load Errors**: Shows error state with retry button
- **Form Validation**: Real-time validation feedback
- **Network Errors**: Toast notifications for user feedback
- **Missing Data**: Graceful fallbacks (shows "N/A" for missing values)

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Environment Variables
No environment variables required for basic functionality.

## 📄 License

This project is open source and available for use in your projects.

## 🤝 Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [AG Grid Documentation](https://www.ag-grid.com/react-data-grid/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)

## 🎯 Future Enhancements

Potential improvements for production use:
- Server-side data fetching with API integration
- Real-time data updates (WebSocket)
- Advanced filtering (date ranges, multi-select)
- Column grouping
- Row aggregation
- Custom themes and branding
- User preferences (saved filters, column widths)
- Data export in multiple formats (Excel, PDF)
- Bulk operations (bulk delete, bulk update)

---

Built with ❤️ using Next.js and AG Grid

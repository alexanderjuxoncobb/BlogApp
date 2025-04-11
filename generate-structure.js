#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

// Base directory
const baseDir = "client-admin";

// Structure definition
const structure = {
  public: {
    "favicon.svg": "",
  },
  src: {
    assets: {
      "react.svg": "",
    },
    components: {
      "AdminLayout.jsx": "",
      "AdminPrivateRoute.jsx": "",
      Dashboard: {
        "StatCard.jsx": "",
        "PostsChart.jsx": "",
        "RecentActivity.jsx": "",
      },
      Login: {
        "AdminLogin.jsx": "",
      },
      Posts: {
        "PostsList.jsx": "",
        "PostEditor.jsx": "",
        "PostFilters.jsx": "",
      },
      Users: {
        "UsersList.jsx": "",
        "UserRoleEditor.jsx": "",
      },
      Comments: {
        "CommentsManager.jsx": "",
      },
      common: {
        "Sidebar.jsx": "",
        "Header.jsx": "",
        "TableWrapper.jsx": "",
      },
    },
    contexts: {
      "AdminAuthContext.jsx": "",
    },
    pages: {
      "DashboardPage.jsx": "",
      "LoginPage.jsx": "",
      "PostsPage.jsx": "",
      "PostEditPage.jsx": "",
      "UsersPage.jsx": "",
      "CommentsPage.jsx": "",
    },
    utils: {
      "api.js": "",
      "helpers.js": "",
    },
    "App.jsx": "",
    "index.css": "",
    "main.jsx": "",
  },
  ".eslintrc.js": "",
  "index.html": "",
  "package.json": "",
  "postcss.config.js": "",
  "tailwind.config.js": "",
  "vite.config.js": "",
};

// Function to create directories and files recursively
function createStructure(basePath, structure) {
  for (const [name, content] of Object.entries(structure)) {
    const currentPath = path.join(basePath, name);

    if (typeof content === "object") {
      // It's a directory
      fs.mkdirSync(currentPath, { recursive: true });
      createStructure(currentPath, content);
    } else {
      // It's a file
      fs.writeFileSync(currentPath, content);
    }
  }
}

// Create the base directory if it doesn't exist
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir);
}

// Create the structure
createStructure(baseDir, structure);

console.log("Folder structure created successfully!");

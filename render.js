<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agile Workspace</title>
    <!-- Chart.js for Analytics -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        :root {
            --bg-primary: #f8fafc;
            --bg-surface: #ffffff;
            --bg-sidebar: #0f172a;
            --text-primary: #1e293b;
            --text-secondary: #64748b;
            --text-sidebar: #94a3b8;
            --border-color: #e2e8f0;
            --accent: #3b82f6;
            --accent-hover: #2563eb;
            --card-shadow: 0 1px 3px rgba(0,0,0,0.1);
            
            /* Status Colors */
            --todo-border: #cbd5e1;
            --progress-border: #3b82f6;
            --done-border: #22c55e;
            --bug-badge: #ef4444;
        }

        [data-theme="dark"] {
            --bg-primary: #0f172a;
            --bg-surface: #1e293b;
            --bg-sidebar: #020617;
            --text-primary: #f8fafc;
            --text-secondary: #94a3b8;
            --text-sidebar: #64748b;
            --border-color: #334155;
            --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            transition: background-color 0.2s, border-color 0.2s;
        }

        body {
            background-color: var(--bg-primary);
            color: var(--text-primary);
            display: flex;
            min-height: 100vh;
        }

        /* Sidebar Styles */
        aside {
            width: 260px;
            background-color: var(--bg-sidebar);
            color: var(--text-sidebar);
            display: flex;
            flex-direction: column;
            padding: 1.5rem 1rem;
            flex-shrink: 0;
        }

        .brand {
            font-size: 1.25rem;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .nav-list {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .nav-item button {
            width: 100%;
            background: none;
            border: none;
            color: inherit;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 0.95rem;
            font-weight: 500;
            text-align: left;
        }

        .nav-item button:hover, .nav-item button.active {
            background-color: rgba(255, 255, 255, 0.1);
            color: #ffffff;
        }

        /* Main Content Layout */
        main {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            overflow-x: hidden;
        }

        header {
            background-color: var(--bg-surface);
            border-bottom: 1px solid var(--border-color);
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .theme-toggle {
            background: none;
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 600;
        }

        .view-content {
            padding: 2rem;
            display: none;
            height: calc(100vh - 73px);
            overflow-y: auto;
        }

        .view-content.active {
            display: block;
        }

        /* Common UI Elements */
        .card {
            background-color: var(--bg-surface);
            border: 1px solid var(--border-color);
            border-radius: 0.5rem;
            padding: 1rem;
            box-shadow: var(--card-shadow);
            margin-bottom: 0.75rem;
        }

        .tag {
            display: inline-block;
            padding: 0.2rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
        }

        .tag-bug { background-color: rgba(239, 68, 68, 0.15); color: #ef4444; }
        .tag-feature { background-color: rgba(59, 130, 246, 0.15); color: #3b82f6; }

        /* Board / Kanban View */
        .kanban-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
            align-items: start;
        }

        .kanban-col {
            background-color: rgba(0,0,0,0.02);
            border: 1px solid var(--border-color);
            border-radius: 0.75rem;
            padding: 1rem;
        }

        [data-theme="dark"] .kanban-col {
            background-color: rgba(255,255,255,0.02);
        }

        .kanban-col h3 {
            font-size: 1rem;
            margin-bottom: 1rem;
            display: flex;
            justify-content: space-between;
        }

        /* Team View Table */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            background-color: var(--bg-surface);
            border-radius: 0.5rem;
            overflow: hidden;
            border: 1px solid var(--border-color);
        }

        .data-table th, .data-table td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
        }

        .data-table th {
            background-color: rgba(0,0,0,0.02);
            color: var(--text-secondary);
            font-weight: 600;
        }

        /* Responsive */
        @media (max-width: 768px) {
            body {
                flex-direction: column;
            }
            aside {
                width: 100%;
                padding: 1rem;
            }
            .nav-list {
                flex-direction: row;
                overflow-x: auto;
            }
            .view-content {
                height: auto;
                padding: 1rem;
            }
        }
    </style>
</head>
<body>

    <!-- Sidebar Navigation -->
    <aside>
        <div class="brand">🚀 Agile Project Management System | Jira-Inspired Kanban Board</div>
        <ul class="nav-list">
            <li class="nav-item"><button class="active" onclick="switchTab('kanban')">📋 Kanban Board</button></li>
            <li class="nav-item"><button onclick="switchTab('backlog')">📌 Backlog</button></li>
            <li class="nav-item"><button onclick="switchTab('sprints')">📅 Sprint Planning</button></li>
            <li class="nav-item"><button onclick="switchTab('bugs')">🐞 Bug Tracking</button></li>
            <li class="nav-item"><button onclick="switchTab('team')">👥 Team Members</button></li>
            <li class="nav-item"><button onclick="switchTab('analytics')">📈 Analytics Dashboard</button></li>
        </ul>
    </aside>

    <!-- Main Workspace Area -->
    <main>
        <header>
            <h1 id="view-title">Kanban Board</h1>
            <button class="theme-toggle" onclick="toggleTheme()" id="theme-btn">🌙 Dark Mode </button>
        </header>

        <!-- 📋 KANBAN BOARD -->
        <section id="kanban" class="view-content active">
            <div class="kanban-grid">
                <div class="kanban-col">
                    <h2>To Do <span>2</span></h2>
                    <div class="card">
                        <span class="tag tag-feature">Feature</span>
                        <h2 style="margin: 0.5rem 0;">User Authentication</h4>
                        <p style="color: var(--text-secondary); font-size: 0.85rem;">Implement OAuth2 & JWT flows.</p>
                    </div>
                    <div class="card">
                        <span class="tag tag-feature">Feature</span>
                        <h3 style="margin: 0.5rem 0;">Email Notifications 📨</h4>
                        <p style="color: var(--text-secondary); font-size: 0.85rem;">Set up SendGrid integration.
                    
                    <!-- 📊 Dashboard Tabs -->
        <div class="dashboard-grid">
            <div class="dash-card">
                <span class="title">📈 Project Progress</span>
                <span class="value" style="color: var(--accent);">80%</span>
            </div>
            
            <div class="dash-card">
                <span class="title">📋 Total Tasks</span>
                <span class="value" id="stat-total">4</span>
            </div>
            
            <div class="dash-card">
                <span class="title">✅ Completed Tasks</span>
                <span class="value" id="stat-completed" style="color: var(--done-border);">1</span>
            </div>
            
            <div class="dash-card">
                <span class="title">⏳ Pending Tasks</span>
                <span class="value" id="stat-pending" style="color: #f59e0b;">3</span>
            </div>
            
            <div class="dash-card">
                <span class="title">🐞 Open Bugs</span>
                <span class="value" id="stat-bugs" style="color: var(--bug-badge);">2</span>
            </div>
        </div>

        <!-- Search & Filter Section -->
        <div class="filter-section">
            <h4>Search & Filter</h4>
            <div class="filter-controls">
                <input type="text" id="search Input" placeholder="🔍 Search Tasks..." oninput="applyFilters()">
                <select id="labelFilter" onchange="applyFilters()">
                    <option value="">🏷️ Filter by Label (All)</option>
                    
                    <option value="feature">Feature</option>
                    <option value="bug">Bug</option>
                    <option value="setup">Setup</option>
                </select>
                <select id="priorityFilter" onchange="applyFilters()">
                    <option value="">🔥 Filter by Priority (All)</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
            </div>
        </div>    
                        
                        </p>
                    </div>
                </div>
                <div class="kanban-col">
                    <h4>In Progress <span>1</span></h4>
                    <div class="card" style="border-left: 4px solid var(--progress-border);">
                        <span class="tag tag-bug">Bug</span>
                        <h5 style="margin: 0.5rem 0;">Fix CSS Overflow</h5>
                        <p style="color: var(--text-secondary); font-size: 0.85rem;">Sidebar breaks on 1024px width screens.</p>
                    </div>
                </div>
                <div class="kanban-col">
                    <h6>Done <span>1</span></h6>
                    <div class="card" style="border-left: 4px solid var(--done-border);">
                        <span class="tag tag-feature">Setup</span>
                        <h4 style="margin: 0.5rem 0;">Database Schema Design</h4>
                        <p style="color: var(--text-secondary); font-size: 0.85rem;">Designed PostgreSQL tables for project modules.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- 📌 BACKLOG -->
        <section id="backlog" class="view-content">
            <h3 style="margin-bottom: 1rem;">Product Backlog Items</h3>
            <div class="card">
                <h4>[US-101] Export Reports to PDF</h4>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">As a manager, I want to download monthly analytics in PDF format.</p>
            </div>
            <div class="card">
                <h4>[US-102] Dark Theme Support</h4>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">As a user, I want a toggle to change the UI to a dark color palette.</p>
            </div>
        </section>

        <!-- 📅 SPRINT PLANNING -->
        <section id="sprints" class="view-content">
            <div class="card">
                <h3>Sprint 14 (Active)</h3>
                <p style="color: var(--text-secondary); margin: 0.5rem 0 1rem 0;">Oct 12 - Oct 26 | Target Velocity: 30 Points</p>
                <div style="background: var(--border-color); height: 8px; border-radius: 4px; overflow: hidden;">
                    <div style="background: var(--accent); width: 65%; height: 100%;"></div>
                </div>
                <p style="font-size: 0.85rem; margin-top: 0.5rem; text-align: right;">65% Completed</p>
            </div>
        </section>

        <!-- 🐞 BUG TRACKING -->
        <section id="bugs" class="view-content">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Issue</th>
                        <th>Severity</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>BUG-01</td>
                        <td>Session drops unexpectedly on mobile browsers</td>
                        <td><span class="tag tag-bug">High</span></td>
                        <td>Open</td>
                    </tr>
                    <tr>
                        <td>BUG-02</td>
                        <td>Incorrect total hours on sprint summary</td>
                        <td><span class="tag tag-feature" style="color: orange; background: rgba(255,165,0,0.15)">Medium</span></td>
                        <td>In Progress</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <!-- 👥 TEAM MEMBERS -->
        <section id="team" class="view-content">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Active Tasks</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Harry Shah</strong></td>
                        <td>Scrum Master</td>
                        <td>2 Tasks</td>
                    </tr>
                    <tr>
                        <td><strong>Dev Rane</strong></td>
                        <td>Frontend Engineer</td>
                        <td>4 Tasks</td>
                    </tr>
                    <tr>
                        <td><strong>Jainam Bhavsar</strong></td>
                        <td>Backend Developer</td>
                        <td>1 Task</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <!-- 📈 ANALYTICS DASHBOARD -->
        <section id="analytics" class="view-content">
            <div style="max-width: 600px; margin: 0 auto;" class="card">
                <h3>Sprint Velocity (Burndown)</h3>
                <canvas id="velocityChart"></canvas>
            </div>
        </section>
    </main>
    
    <!-- Footer -->
    <footer> © 2026 Heer Patel | Agile Workspace </footer>
    </main>

    <script>
        // Tab Navigation
        function switchTab(tabId) {
            document.querySelectorAll('.view-content').forEach(view => {
                view.classList.remove('active');
            });
            document.querySelectorAll('.nav-item button').forEach(btn => {
                btn.classList.remove('active');
            });

            document.getElementById(tabId).classList.add('active');
            
            // Set active state on target sidebar item
            event.currentTarget.classList.add('active');

            // Update Header Title
            const titles = {
                'kanban': 'Kanban Board',
                'backlog': 'Product Backlog',
                'sprints': 'Sprint Planning',
                'bugs': 'Bug Tracking',
                'team': 'Team Members',
                'analytics': 'Analytics Dashboard'
            };
            document.getElementById('view-title').innerText = titles[tabId];
        }

        // Dark Mode Toggle
        function toggleTheme() {
            const body = document.body;
            const btn = document.getElementById('theme-btn');
            
            if (body.getAttribute('data-theme') === 'dark') {
                body.removeAttribute('data-theme');
                btn.innerText = '🌙 Dark Mode';
            } else {
                body.setAttribute('data-theme', 'dark');
                btn.innerText = '☀️ Light Mode';
            }
        }

        // Analytics Chart Setup
        document.addEventListener("DOMContentLoaded", () => {
            const ctx = document.getElementById('velocityChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Day 1', 'Day 3', 'Day 5', 'Day 7', 'Day 9', 'Day 12'],
                    datasets: [
                        {
                            label: 'Ideal Burndown',
                            data: [30, 24, 18, 12, 6, 0],
                            borderColor: '#94a3b8',
                            borderDash: [5, 5],
                            fill: false
                        },
                        {
                            label: 'Actual Progress',
                            data: [30, 26, 15, 10, 8, 2],
                            borderColor: '#3b82f6',
                            tension: 0.2,
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'bottom' }
                    }
                }
            });
        });
    </script>
</body>
</html>

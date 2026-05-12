
import os

file_path = r'c:\DevOps\QuanLyChiTieu_devops\QuanLyChiTieu_devops\frontend\src\index.css'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace settings-nav
old_nav = """.settings-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}"""
new_nav = """.settings-nav {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  @media (min-width: 900px) {
    flex-direction: column;
    overflow-x: visible;
  }
  gap: 0.5rem;
}"""

# Replace profile-main-card
old_profile = """.profile-main-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}"""
new_profile = """.profile-main-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;
  @media (min-width: 640px) {
    flex-direction: row;
    text-align: left;
  }
  gap: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}"""

# Replace danger-zone
old_danger = """.danger-zone {
  border: 1px solid #fee2e2;
  background-color: #fef2f2;
  border-radius: 1rem;
  padding: 2rem;
  margin-top: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}"""
new_danger = """.danger-zone {
  border: 1px solid #fee2e2;
  background-color: #fef2f2;
  border-radius: 1rem;
  padding: 2rem;
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  text-align: center;
  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }
  gap: 2rem;
}"""

content = content.replace(old_nav, new_nav)
content = content.replace(old_profile, new_profile)
content = content.replace(old_danger, new_danger)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Replacement successful")

// Project management functions for index.html

// Show project management menu
function showProjectMenu(projectName, x, y) {
    // Remove existing menu if any
    const existingMenu = document.getElementById('projectMenu');
    if (existingMenu) existingMenu.remove();

    // Create menu
    const menu = document.createElement('div');
    menu.id = 'projectMenu';
    menu.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        padding: 8px;
        z-index: 10000;
        min-width: 150px;
        animation: menuFadeIn 0.2s ease;
    `;

    menu.innerHTML = `
        <style>
            @keyframes menuFadeIn {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }
            .menu-item {
                padding: 12px 16px;
                cursor: pointer;
                border-radius: 8px;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 0.95rem;
            }
            .menu-item:hover {
                background: #f3f4f6;
            }
            .menu-item-rename { color: #059669; }
            .menu-item-delete { color: #ef4444; }
        </style>
        <div class="menu-item menu-item-rename" onclick="renameProject('${projectName}')">
            ✏️ 重命名
        </div>
        <div class="menu-item menu-item-delete" onclick="deleteProject('${projectName}')">
            🗑️ 删除项目
        </div>
    `;

    document.body.appendChild(menu);

    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

// Rename project
async function renameProject(oldName) {
    const newName = prompt('请输入新的项目名称:', oldName);
    if (!newName || newName === oldName) return;
    if (!newName.trim()) {
        alert('项目名称不能为空');
        return;
    }

    try {
        // Check if new name already exists
        const { data: existing } = await supabase
            .from('facility_settings')
            .select('project_name')
            .eq('project_name', newName.trim())
            .eq('user_id', currentUser.id)
            .single();

        if (existing) {
            alert('项目名称已存在，请使用其他名称');
            return;
        }

        // Update facility_settings
        const { error: error1 } = await supabase
            .from('facility_settings')
            .update({ project_name: newName.trim() })
            .eq('project_name', oldName)
            .eq('user_id', currentUser.id);

        if (error1) throw error1;

        // Update daily_phenotypes
        const { error: error2 } = await supabase
            .from('daily_phenotypes')
            .update({ project_name: newName.trim() })
            .eq('project_name', oldName)
            .eq('user_id', currentUser.id);

        if (error2) throw error2;

        // Update weekly_phenotypes
        const { error: error3 } = await supabase
            .from('weekly_phenotypes')
            .update({ project_name: newName.trim() })
            .eq('project_name', oldName)
            .eq('user_id', currentUser.id);

        if (error3) throw error3;

        // Update localStorage if this was the current project
        if (localStorage.getItem('currentProject') === oldName) {
            localStorage.setItem('currentProject', newName.trim());
            localStorage.setItem('lastProjectName', newName.trim());
        }

        alert('✅ 项目重命名成功！');
        loadProjects(); // Refresh list
    } catch (err) {
        console.error('Rename error:', err);
        alert('❌ 重命名失败: ' + err.message);
    }
}

// Delete project
async function deleteProject(projectName) {
    const confirmed = confirm(`确定要删除项目 "${projectName}" 吗？\n\n⚠️ 此操作将永久删除该项目及其所有数据，且无法恢复！`);
    if (!confirmed) return;

    try {
        // Delete from daily_phenotypes
        const { error: error1 } = await supabase
            .from('daily_phenotypes')
            .delete()
            .eq('project_name', projectName)
            .eq('user_id', currentUser.id);

        if (error1) throw error1;

        // Delete from weekly_phenotypes
        const { error: error2 } = await supabase
            .from('weekly_phenotypes')
            .delete()
            .eq('project_name', projectName)
            .eq('user_id', currentUser.id);

        if (error2) throw error2;

        // Delete from facility_settings
        const { error: error3 } = await supabase
            .from('facility_settings')
            .delete()
            .eq('project_name', projectName)
            .eq('user_id', currentUser.id);

        if (error3) throw error3;

        // Clear localStorage if this was the current project
        if (localStorage.getItem('currentProject') === projectName) {
            localStorage.removeItem('currentProject');
            localStorage.removeItem('lastProjectName');
        }

        alert('✅ 项目已删除');
        loadProjects(); // Refresh list
    } catch (err) {
        console.error('Delete error:', err);
        alert('❌ 删除失败: ' + err.message);
    }
}

// ====================================
// COMMON CONFIGURATION AND UTILITIES
// ====================================

// Supabase Configuration
var SUPABASE_URL = 'https://dompuruxntwvzqfnhufe.supabase.co';
var SUPABASE_ANON_KEY = 'sb_publishable_BAt1IGtGXbf99aB3wcnuxQ_5l91ZrVI';

// Initialize Supabase client
// Check if client is already initialized (has .from method) to prevent re-initialization error
if (!window.supabase || typeof window.supabase.from !== 'function') {
	if (window.supabase && window.supabase.createClient) {
		// Overwrite the global supabase object (from CDN factory) with the initialized client
		window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
	} else {
		console.error('Supabase CDN script not loaded or createClient not found.');
	}
}


// Language Configuration
var currentLang = localStorage.getItem('language') || 'zh';

var translations = {
	zh: {
		title: '🌱 得希表型采集系统',
		subtitle: '使用本系统记录和管理植物表型数据，助力精准农业研究与分析。',
		nav: {
			home: '🏠 首页',
			calendar: '📅 采集日历',
			collection: '📊 数据采集',
			statistics: '📈 统计数量',
			trends: '📉 趋势分析'
		},
		exportBtn: '📥 导出 CSV',
		syncBtn: '☁️ 同步到云端',
		authBtn: '🔗 登录',
		statusLabel: '状态：',
		statusReady: '系统就绪',
		calendarTitle: '📅 采集日历',
		calendarSubtitle: '查看和管理数据采集历史，追踪每日采集进度',
		dataCollection: '📊 指标采集',
		statisticIndicators: '📊 累积统计指标',
		trendAnalysis: '📈 趋势分析',
		statisticCount: '统计数量',
		prevMonth: '◀ 上月',
		nextMonth: '下月 ▶',
		selectIndicator: '选择指标...',
		loading: '加载中...',
		noData: '暂无数据',
		weekdays: ['日', '一', '二', '三', '四', '五', '六'],
		indicators: {
			growth_cm: '生长量',
			stem_mm: '茎粗',
			leaf_count: '叶片总数',
			leaf_length_cm: '叶长',
			leaf_width_cm: '叶宽',
			potential_flower_count: '潜力开花数',
			current_flower_order: '当前开花序数',
			accum_ear_count: '单头累计坐果穗数',
			new_grain_count: '本周单头新增坐果数',
			weekly_yield_kg: '单周产量',
			single_grain_g: '单粒果重',
			new_harvest_grain_count: '本周单头采收果粒数',
			ear_weight_g: '单穗重',
			brix: '可溶性固形物',
			acidity: '酸度',
			cracking_rate: '裂果率',
			irrigation_ml: '灌溉量',
			reflux_ml: '回液量',
			dripper_count: '滴箭个数',
			reflux_ec: '回液EC值',
			reflux_ph: '回液pH值',
			accum_grain_count: '单头累计坐果粒数',
			total_yield_kg: '总产量',
			greenhouse_area_m2: '温室面积',
			unit_yield: '单位产量',
			total_harvest_ear_count: '单头总采收果穗数',
			single_head_yield_g: '单头产量',
			reflux_ratio: '回液比例'
		}
	},
	en: {
		title: '🌱 Deci Phenotype Collection System',
		subtitle: 'Record and manage plant phenotype data for precision agriculture research and analysis.',
		nav: {
			home: '🏠 Home',
			calendar: '📅 Calendar',
			collection: '📊 Collection',
			statistics: '📈 Statistics',
			trends: '📉 Trends'
		},
		exportBtn: '📥 Export CSV',
		syncBtn: '☁️ Sync to Cloud',
		authBtn: '🔗 Login',
		statusLabel: 'Status: ',
		statusReady: 'System Ready',
		calendarTitle: '📅 Collection Calendar',
		calendarSubtitle: 'View and manage data collection history, track daily collection progress',
		dataCollection: '📊 Data Collection',
		statisticIndicators: '📊 Cumulative Statistics',
		trendAnalysis: '📈 Trend Analysis',
		statisticCount: 'Statistic Count',
		prevMonth: '◀ Prev',
		nextMonth: 'Next ▶',
		selectIndicator: 'Select Indicator...',
		loading: 'Loading...',
		noData: 'No Data',
		weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		indicators: {
			growth_cm: 'Growth',
			stem_mm: 'Stem Diameter',
			leaf_count: 'Total Leaf Count',
			leaf_length_cm: 'Leaf Length',
			leaf_width_cm: 'Leaf Width',
			potential_flower_count: 'Potential Flower Count',
			current_flower_order: 'Current Flowering Order',
			accum_ear_count: 'Accumulated Fruit Clusters',
			new_grain_count: 'Weekly New Fruit Count',
			weekly_yield_kg: 'Weekly Yield',
			single_grain_g: 'Single Fruit Weight',
			new_harvest_grain_count: 'Weekly Harvest Count',
			ear_weight_g: 'Cluster Weight',
			brix: 'Soluble Solids',
			acidity: 'Acidity',
			cracking_rate: 'Cracking Rate',
			irrigation_ml: 'Irrigation Volume',
			reflux_ml: 'Reflux Volume',
			dripper_count: 'Dripper Count',
			reflux_ec: 'Reflux EC',
			reflux_ph: 'Reflux pH',
			accum_grain_count: 'Accumulated Fruits',
			total_yield_kg: 'Total Yield',
			greenhouse_area_m2: 'Greenhouse Area',
			unit_yield: 'Unit Yield',
			total_harvest_ear_count: 'Total Harvest Clusters',
			single_head_yield_g: 'Single Head Yield',
			reflux_ratio: 'Reflux Ratio'
		}
	}
};

// Indicators Configuration
var indicatorsConfig = [
	// 测量指标
	{ field: 'growth_cm', unit: 'cm', unitEn: 'cm', min: 5, max: 40, step: 0.1, defaultValue: 5 },
	{ field: 'stem_mm', unit: 'mm', unitEn: 'mm', min: 2, max: 15, step: 0.1, defaultValue: 2 },
	{ field: 'leaf_count', unit: '个', unitEn: 'pcs', min: 5, max: 23, step: 1, defaultValue: 5 },
	{ field: 'leaf_length_cm', unit: 'cm', unitEn: 'cm', min: 20, max: 60, step: 0.1, defaultValue: 20 },
	{ field: 'leaf_width_cm', unit: 'cm', unitEn: 'cm', min: 5, max: 60, step: 0.1, defaultValue: 5 },
	{ field: 'potential_flower_count', unit: '串', unitEn: 'clusters', min: 8, max: 18, step: 1, defaultValue: 8 },
	{ field: 'current_flower_order', unit: '串', unitEn: 'order', min: 1, max: 60, step: 1, defaultValue: 1 },
	{ field: 'accum_ear_count', unit: '个', unitEn: 'pcs', min: 1, max: 60, step: 1, defaultValue: 1 },
	{ field: 'new_grain_count', unit: '个', unitEn: 'pcs', min: 1, max: 30, step: 1, defaultValue: 1 },
	{ field: 'weekly_yield_kg', unit: 'kg', unitEn: 'kg', min: 0, max: 300, step: 0.1, defaultValue: 0 },
	{ field: 'single_grain_g', unit: 'g', unitEn: 'g', min: 5, max: 25, step: 0.1, defaultValue: 5 },
	{ field: 'new_harvest_grain_count', unit: 'g', unitEn: 'pcs', min: 1, max: 720, step: 1, defaultValue: 1 },
	{ field: 'ear_weight_g', unit: 'g', unitEn: 'g', min: 50, max: 280, step: 1, defaultValue: 50 },
	{ field: 'brix', unit: '', unitEn: '', min: 4, max: 13, step: 0.1, defaultValue: 4 },
	{ field: 'acidity', unit: '', unitEn: '', min: 0, max: 60, step: 0.1, defaultValue: 0 },
	{ field: 'cracking_rate', unit: '%', unitEn: '%', min: 0, max: 60, step: 0.1, defaultValue: 0 },
	{ field: 'irrigation_ml', unit: 'ml', unitEn: 'ml', min: 0, max: 3000, step: 10, defaultValue: 0 },
	{ field: 'reflux_ml', unit: 'ml', unitEn: 'ml', min: 0, max: 8000, step: 10, defaultValue: 0 },
	{ field: 'dripper_count', unit: '个', unitEn: 'pcs', min: 0, max: 100, step: 1, defaultValue: 0, isConstant: true },
	{ field: 'reflux_ec', unit: 'mS/cm', unitEn: 'mS/cm', min: 3, max: 9, step: 0.1, defaultValue: 3 },
	{ field: 'reflux_ph', unit: '', unitEn: '', min: 4, max: 9, step: 0.1, defaultValue: 4 },
	// 计算指标 (用于统计页面)
	{ field: 'accum_grain_count', unit: '个', unitEn: 'pcs', min: 1, max: 720, step: 1, defaultValue: 1, isStatistic: true },
	{ field: 'total_yield_kg', unit: 'kg', unitEn: 'kg', min: 0, max: 10000, step: 0.1, defaultValue: 0, isStatistic: true },
	{ field: 'greenhouse_area_m2', unit: 'm²', unitEn: 'm²', min: 0, max: 10000, step: 0.1, defaultValue: 0, isConstant: true },
	{ field: 'unit_yield', unit: 'kg/m²', unitEn: 'kg/m²', min: 0, max: 100, step: 0.01, defaultValue: 0, isStatistic: true },
	{ field: 'total_harvest_ear_count', unit: '个', unitEn: 'pcs', min: 1, max: 60, step: 1, defaultValue: 1, isStatistic: true },
	{ field: 'single_head_yield_g', unit: 'g', unitEn: 'g', min: 0, max: 18000, step: 10, defaultValue: 0, isStatistic: true },
	{ field: 'reflux_ratio', unit: '%', unitEn: '%', min: 0, max: 100, step: 0.1, defaultValue: 0, isStatistic: true }
];

// Get indicators with current language
function getIndicators() {
	const lang = translations[currentLang];
	return indicatorsConfig.map(ind => ({
		...ind,
		name: lang.indicators[ind.field],
		unit: currentLang === 'zh' ? ind.unit : ind.unitEn
	}));
}

// Helper function to get Beijing time (UTC+8)
function getBeijingTime() {
	const now = new Date();
	const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
	const beijingTime = new Date(utcTime + (8 * 3600000));
	return beijingTime;
}

// Calculate week number of the year (ISO week)
function getWeekNumber(date) {
	const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
	const dayNum = d.getUTCDay() || 7;
	d.setUTCDate(d.getUTCDate() + 4 - dayNum);
	const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// Language switching
function switchLanguage() {
	currentLang = currentLang === 'zh' ? 'en' : 'zh';
	localStorage.setItem('language', currentLang);
	location.reload();
}

// Set active navigation link
function setActiveNav(pageName) {
	const links = document.querySelectorAll('.nav-link');
	links.forEach(link => {
		if (link.getAttribute('data-page') === pageName) {
			link.classList.add('active');
		} else {
			link.classList.remove('active');
		}
	});
}

// Update language display
function updateLanguageDisplay() {
	const lang = translations[currentLang];

	// Update all elements with data-lang attribute
	document.querySelectorAll('[data-lang]').forEach(el => {
		const key = el.getAttribute('data-lang');
		const keys = key.split('.');
		let value = lang;
		for (const k of keys) {
			value = value[k];
		}
		if (value) {
			// Preserve emojis
			const emojis = el.textContent.match(/[🌱📅📊📈📉📥☁️🔗◀▶🏠]/g) || [];
			el.textContent = emojis.join('') + ' ' + value.replace(/[🌱📅📊📈📉📥☁️🔗◀▶🏠]/g, '').trim();
		}
	});

	// Update page title
	document.title = lang.title;

	// Update language switch button
	const langSwitch = document.getElementById('langSwitch');
	if (langSwitch) {
		langSwitch.textContent = currentLang === 'zh' ? 'EN' : '中文';
	}
}

// Global user state
var currentUser = null;

// Authentication functions
async function initAuth() {
	// Check for guest mode
	if (localStorage.getItem('guest_mode') === 'true') {
		currentUser = {
			id: 'guest',
			email: 'guest@example.com',
			is_guest: true
		};

		const statusEl = document.getElementById('status');
		const syncBtn = document.getElementById('syncBtn');
		const authBtn = document.getElementById('authBtn');


		if (statusEl) statusEl.textContent = '👀 游客访问';
		if (syncBtn) syncBtn.style.display = 'none'; // Guests can't sync
		// authBtn handled by updateUserDisplay

		return { user: currentUser };
	}

	const { data: { session } } = await supabase.auth.getSession();

	const statusEl = document.getElementById('status');
	const syncBtn = document.getElementById('syncBtn');
	const authBtn = document.getElementById('authBtn');

	if (session) {
		currentUser = session.user;
		if (statusEl) statusEl.textContent = '✅ 已登录';
		if (syncBtn) syncBtn.style.display = 'inline-block';
		// authBtn handling moved to updateUserDisplay
	} else {
		// Only check query params for login if not a guest
		if (statusEl) statusEl.textContent = '请登录以同步数据';
		if (syncBtn) syncBtn.style.display = 'none';
		// authBtn handling moved to updateUserDisplay
	}

	return session;
}

async function signIn() {
	const email = prompt('请输入邮箱:');
	const password = prompt('请输入密码:');

	if (!email || !password) return;

	const statusEl = document.getElementById('status');
	if (statusEl) statusEl.textContent = '正在登录...';

	const { data, error } = await supabase.auth.signInWithPassword({
		email: email,
		password: password
	});

	if (error) {
		if (statusEl) statusEl.textContent = '正在注册...';

		const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
			email: email,
			password: password
		});

		if (signUpError) {
			if (statusEl) statusEl.textContent = '❌ 注册失败: ' + signUpError.message;
			return;
		}

		if (statusEl) statusEl.textContent = '✅ 注册成功，请登录';
		currentUser = signUpData.user;
	} else {
		if (statusEl) statusEl.textContent = '✅ 登录成功';
		currentUser = data.user;
	}

	location.reload();
}

// Initialize common elements and layout
function initCommon() {
	// 1. Dynamic Layout Adjustments
	const nav = document.querySelector('.nav-bar');
	if (nav) {
		// A. Setup User Area (Right top)
		let userArea = document.getElementById('navUserArea');
		if (!userArea) {
			userArea = document.createElement('div');
			userArea.id = 'navUserArea';
			userArea.style.display = 'flex';
			userArea.style.alignItems = 'center';
			userArea.style.gap = '15px';
			userArea.style.marginLeft = 'auto'; // Push to right
			nav.appendChild(userArea);
		}

		// Move existing auth button if present
		const existingAuthBtn = document.getElementById('authBtn');
		if (existingAuthBtn) {
			// Remove from old parent
			if (existingAuthBtn.parentElement && existingAuthBtn.parentElement !== userArea) {
				// If it was wrapped in a div (calendar.html case), looking at previous siblings might be needed
				// But just appending to userArea works.
				userArea.appendChild(existingAuthBtn);
			}
			// existingAuthBtn.style.display = 'inline-block'; // DON'T FORCE SHOW HERE! Let updateUserDisplay handle it.
		} else {
			// Create if missing
			const btn = document.createElement('button');
			btn.id = 'authBtn';
			btn.className = 'nav-link';
			btn.style.cursor = 'pointer';
			btn.textContent = '🔗 登录';
			userArea.appendChild(btn);
		}

		// B. Setup Language Switch (Page Header Top-Right)
		const langSwitch = document.getElementById('langSwitch');
		const pageHeader = document.querySelector('.page-header');

		if (langSwitch) {
			if (pageHeader) {
				// Move to Page Header
				pageHeader.style.position = 'relative'; // Ensure header is relative
				pageHeader.appendChild(langSwitch);

				// Set Absolute Position
				langSwitch.style.position = 'absolute';
				langSwitch.style.top = '20px';
				langSwitch.style.right = '20px';
				langSwitch.style.margin = '0';
				langSwitch.style.zIndex = '10'; // Ensure above content
			} else {
				// Fallback or leave as is if no header
				// Check for main container
				const mainContainer = document.querySelector('.main-container');
				if (mainContainer) {
					mainContainer.style.position = 'relative';
					mainContainer.appendChild(langSwitch);
					langSwitch.style.position = 'absolute';
					langSwitch.style.top = '20px';
					langSwitch.style.right = '20px';
				}
			}
		}
	}

	// Set up language switch button
	const langSwitch = document.getElementById('langSwitch');
	if (langSwitch) {
		// Copy logic from before, ensure listener isn't double added if node moved?
		// cloneNode(true) creates new, but moving node keeps listeners.
		langSwitch.addEventListener('click', switchLanguage);
	}

	// Set up auth button listener
	const authBtn = document.getElementById('authBtn');
	if (authBtn) {
		authBtn.addEventListener('click', signIn);
	}

	// Update language display
	updateLanguageDisplay();
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
	// Determine user state first? No, initAuth is async.
	// Init layout first so elements exist.
	initCommon();
	initAuth().then(updateUserDisplay);
});

// Helper to update User Display in Nav
function updateUserDisplay() {
	const userArea = document.getElementById('navUserArea');
	const authBtn = document.getElementById('authBtn');
	if (!userArea || !authBtn) return;

	// Remove old items
	const oldProfile = document.getElementById('userProfileContainer');
	if (oldProfile) oldProfile.remove();
	const oldLabel = document.getElementById('userLabel');
	if (oldLabel) oldLabel.remove();

	if (currentUser) {
		// Log
		console.log('UpdateUserDisplay: User logged in, hiding authBtn');
		// Hide default auth button, use profile dropdown instead
		if (authBtn) {
			authBtn.style.display = 'none';
			authBtn.setAttribute('style', 'display: none !important'); // Force hide
		}

		const container = document.createElement('div');
		container.id = 'userProfileContainer';
		container.style.position = 'relative';
		container.style.marginLeft = '10px';
		container.style.cursor = 'pointer';

		// Avatar Icon
		const avatar = document.createElement('div');
		avatar.style.width = '38px';
		avatar.style.height = '38px';
		avatar.style.borderRadius = '50%';
		avatar.style.backgroundColor = 'rgba(255,255,255,0.2)';
		avatar.style.display = 'flex';
		avatar.style.alignItems = 'center';
		avatar.style.justifyContent = 'center';
		avatar.style.border = '2px solid rgba(255,255,255,0.9)';
		avatar.style.fontSize = '20px';
		avatar.style.transition = 'all 0.2s ease';
		avatar.textContent = currentUser.is_guest ? '👀' : '👤';

		// Add hover effect
		avatar.onmouseover = () => {
			avatar.style.backgroundColor = 'rgba(255,255,255,0.4)';
			avatar.style.transform = 'scale(1.05)';
		};
		avatar.onmouseout = () => {
			avatar.style.backgroundColor = 'rgba(255,255,255,0.2)';
			avatar.style.transform = 'scale(1)';
		};

		container.appendChild(avatar);

		// Dropdown Menu
		const dropdown = document.createElement('div');
		dropdown.id = 'userDropdown';
		dropdown.style.position = 'absolute';
		dropdown.style.top = '50px';
		dropdown.style.right = '-10px'; // Align right edge
		dropdown.style.backgroundColor = 'white';
		dropdown.style.borderRadius = '12px';
		dropdown.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
		dropdown.style.padding = '15px';
		dropdown.style.minWidth = '220px';
		dropdown.style.display = 'none';
		dropdown.style.zIndex = '1000';
		dropdown.style.color = '#333';
		dropdown.style.border = '1px solid rgba(0,0,0,0.05)';

		// Triangle pointer
		const arrow = document.createElement('div');
		arrow.style.position = 'absolute';
		arrow.style.top = '-6px';
		arrow.style.right = '20px';
		arrow.style.width = '12px';
		arrow.style.height = '12px';
		arrow.style.background = 'white';
		arrow.style.transform = 'rotate(45deg)';
		arrow.style.borderTop = '1px solid rgba(0,0,0,0.05)';
		arrow.style.borderLeft = '1px solid rgba(0,0,0,0.05)';
		dropdown.appendChild(arrow);

		// Email Display
		const emailLabel = document.createElement('div');
		emailLabel.style.fontSize = '0.85rem';
		emailLabel.style.color = '#6b7280';
		emailLabel.style.marginBottom = '4px';
		emailLabel.textContent = currentUser.is_guest ? '访客 (Guest)' : '当前用户 (Account)';
		dropdown.appendChild(emailLabel);

		const emailDiv = document.createElement('div');
		emailDiv.style.marginBottom = '12px';
		emailDiv.style.fontWeight = 'bold';
		emailDiv.style.fontSize = '0.95rem';
		emailDiv.style.color = '#1f2937';
		emailDiv.style.paddingBottom = '12px';
		emailDiv.style.borderBottom = '1px solid #f3f4f6';
		emailDiv.style.wordBreak = 'break-all';
		emailDiv.textContent = currentUser.email || 'User';
		dropdown.appendChild(emailDiv);

		// Logout Button
		const logoutOption = document.createElement('button');
		logoutOption.textContent = '🚪 退出登录 (Logout)';
		logoutOption.style.width = '100%';
		logoutOption.style.padding = '10px';
		logoutOption.style.cursor = 'pointer';
		logoutOption.style.borderRadius = '8px';
		logoutOption.style.fontSize = '0.9rem';
		logoutOption.style.border = 'none';
		logoutOption.style.background = '#fef2f2'; // light red bg
		logoutOption.style.color = '#dc2626'; // red text
		logoutOption.style.fontWeight = '600';
		logoutOption.style.transition = 'all 0.2s';

		logoutOption.onmouseover = () => logoutOption.style.background = '#fee2e2';
		logoutOption.onmouseout = () => logoutOption.style.background = '#fef2f2';

		logoutOption.onclick = async (e) => {
			e.stopPropagation();
			if (confirm('确定要退出登录吗？\nAre you sure you want to logout?')) {
				try {
					await supabase.auth.signOut();
				} catch (err) {
					console.error('SignOut error:', err);
				} finally {
					// Force clear Supabase token to prevent loop
					// Key format: sb-<project_id>-auth-token
					// Project ID extracted from SUPABASE_URL: dompuruxntwvzqfnhufe
					localStorage.removeItem('sb-dompuruxntwvzqfnhufe-auth-token');
					localStorage.removeItem('guest_mode');
					window.location.href = 'welcome.html';
				}
			}
		};
		dropdown.appendChild(logoutOption);
		container.appendChild(dropdown);

		// Toggle Event
		container.onclick = (e) => {
			e.stopPropagation();
			const isVisible = dropdown.style.display === 'block';
			dropdown.style.display = isVisible ? 'none' : 'block';
		};

		// Close on outside click
		document.addEventListener('click', () => {
			dropdown.style.display = 'none';
		});

		// Insert before LangSwitch if possible (To be consistent: User Icon Left, Lang Right?)
		// Or User Icon Right, Lang Left?
		// User asked: "右上角直接显示..." usually means User is the Rightmost items.
		// But Lang switch is also "corner".
		// I will place Avatar BEFORE LangSwitch. So: [Avatar] [Lang] (Right Edge)
		// Or [Lang] [Avatar]
		// Let's stick to [Lang] [Avatar] as avatar is more "Menu" like.
		// In my code I appendChild langSwitch to userArea. 
		// If I append container to userArea, it goes AFTER langSwitch.
		// Let's do: [Lang] ...... [Avatar].
		// Actually, let's keep it simple: Just append. It will be the right-most item.
		userArea.appendChild(container);

	} else {
		// Not Logged In - Show login button
		authBtn.style.display = 'inline-block';
		authBtn.textContent = '🔗 登录';
		authBtn.onclick = () => {
			window.location.href = 'welcome.html';
		};
	}
}

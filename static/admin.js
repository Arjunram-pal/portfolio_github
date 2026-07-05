'use strict';

(function () {
  const supabaseClient = window.PortfolioSupabase || null;
  const loginForm = document.getElementById('adminLoginForm');
  const loginStatus = document.getElementById('adminLoginStatus');
  const adminPanel = document.getElementById('adminPanel');
  const adminUserEmail = document.getElementById('adminUserEmail');
  const signOutBtn = document.getElementById('adminSignOutBtn');
  const blogForm = document.getElementById('adminBlogForm');
  const blogStatus = document.getElementById('adminBlogStatus');
  const routineForm = document.getElementById('adminRoutineForm');
  const routineStatus = document.getElementById('adminRoutineStatus');
  const configNotice = document.getElementById('adminConfigNotice');
  const loginEmailInput = loginForm ? loginForm.querySelector('input[name="email"]') : null;

  function setText(target, value) {
    if (!target) return;
    target.textContent = value;
  }

  function setPanelVisibility() {
    const session = supabaseClient ? supabaseClient.getSession() : null;

    if (loginForm) {
      loginForm.hidden = Boolean(session);
    }

    if (adminPanel) {
      adminPanel.hidden = !session;
    }

    if (adminUserEmail) {
      setText(adminUserEmail, session && session.user ? session.user.email : '');
    }
  }

  if (!supabaseClient || !supabaseClient.isConfigured()) {
    if (configNotice) {
      configNotice.hidden = false;
    }

    if (loginForm) {
      loginForm.hidden = true;
    }

    if (adminPanel) {
      adminPanel.hidden = true;
    }

    return;
  }

  if (loginEmailInput) {
    const config = supabaseClient.getConfig();
    if (config.adminEmail) {
      loginEmailInput.value = config.adminEmail;
    }
  }

  setPanelVisibility();

  if (loginForm) {
    loginForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      const formData = new FormData(loginForm);
      const email = String(formData.get('email') || '').trim();
      const password = String(formData.get('password') || '');

      try {
        setText(loginStatus, 'Signing in...');
        await supabaseClient.signIn(email, password);
        setText(loginStatus, 'Signed in successfully.');
        loginForm.reset();
        setPanelVisibility();
      } catch (error) {
        setText(loginStatus, 'Sign-in failed: ' + error.message);
      }
    });
  }

  if (signOutBtn) {
    signOutBtn.addEventListener('click', async function () {
      try {
        await supabaseClient.signOut();
        setText(loginStatus, 'Signed out.');
        setPanelVisibility();
      } catch (error) {
        setText(loginStatus, 'Sign-out failed: ' + error.message);
      }
    });
  }

  if (blogForm) {
    blogForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      const formData = new FormData(blogForm);
      const payload = {
        title: String(formData.get('title') || '').trim(),
        category: String(formData.get('category') || '').trim(),
        content: String(formData.get('content') || '').trim()
      };

      try {
        setText(blogStatus, 'Publishing blog post...');
        await supabaseClient.createBlogPost(payload);
        blogForm.reset();
        setText(blogStatus, 'Blog post published. Refresh blog.html to see it.');
      } catch (error) {
        setText(blogStatus, 'Blog publish failed: ' + error.message);
      }
    });
  }

  if (routineForm) {
    routineForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      const formData = new FormData(routineForm);
      const payload = {
        message: String(formData.get('message') || '').trim()
      };

      try {
        setText(routineStatus, 'Publishing routine update...');
        await supabaseClient.createRoutinePost(payload);
        routineForm.reset();
        setText(routineStatus, 'Routine update published. Refresh daily-routine.html to see it.');
      } catch (error) {
        setText(routineStatus, 'Routine publish failed: ' + error.message);
      }
    });
  }
})();

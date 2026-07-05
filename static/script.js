'use strict';

const elementToggleFunc = function (elem) {
  elem.classList.toggle('active');
};

const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');

if (sidebarBtn && sidebar) {
  sidebarBtn.addEventListener('click', function () {
    elementToggleFunc(sidebar);
  });
}

function parseTimestamp(value) {
  const raw = String(value || '');
  if (!raw) return new Date();
  return new Date(raw);
}

function formatDate(value) {
  const date = parseTimestamp(value);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
}

function formatTime(value) {
  const date = parseTimestamp(value);
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return String(text).replace(/[&<>"']/g, function (match) {
    return map[match];
  });
}

const form = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn = document.querySelector('[data-form-btn]');
const formStatus = document.querySelector('[data-form-status]');

if (form) {
  formInputs.forEach(function (input) {
    input.addEventListener('input', function () {
      if (form.checkValidity()) {
        formBtn.removeAttribute('disabled');
      } else {
        formBtn.setAttribute('disabled', '');
      }
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const fullname = String(formData.get('fullname') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const contactEmail = form.dataset.contactEmail || 'arjunp087461@gmail.com';

    const subject = encodeURIComponent('Portfolio message from ' + fullname);
    const body = encodeURIComponent(
      'Name: ' + fullname + '\n' +
      'Email: ' + email + '\n\n' +
      'Message:\n' + message
    );

    window.location.href = 'mailto:' + contactEmail + '?subject=' + subject + '&body=' + body;

    if (formStatus) {
      formStatus.textContent = 'Your email app should open now with the message filled in.';
    }
  });
}

const blogsContainer = document.getElementById('blogs-container');
const blogModal = document.getElementById('blogModal');
const blogModalTitle = document.getElementById('blogModalTitle');
const blogModalMeta = document.getElementById('blogModalMeta');
const blogModalContent = document.getElementById('blogModalContent');
const blogModalCloseBtn = document.getElementById('blogModalCloseBtn');
const blogDataById = new Map();

function openBlogModal(blogId) {
  const blogData = blogDataById.get(String(blogId));
  if (!blogData || !blogModal || !blogModalTitle || !blogModalMeta || !blogModalContent) {
    return;
  }

  blogModalTitle.textContent = blogData.title;
  blogModalMeta.textContent = blogData.category + ' • ' + formatDate(blogData.timestamp);
  blogModalContent.innerHTML = escapeHtml(blogData.content).replace(/\n/g, '<br>');
  blogModal.classList.add('active');
  blogModal.setAttribute('aria-hidden', 'false');
}

function closeBlogModal() {
  if (!blogModal) return;
  blogModal.classList.remove('active');
  blogModal.setAttribute('aria-hidden', 'true');
}

function renderBlogs() {
  if (!blogsContainer) return;

  const blogs = Array.isArray(window.PORTFOLIO_BLOGS) ? window.PORTFOLIO_BLOGS : [];
  blogsContainer.innerHTML = '';
  blogDataById.clear();

  if (blogs.length === 0) {
    blogsContainer.innerHTML = "<p class='empty-state-text'>No blog posts added yet.</p>";
    return;
  }

  blogs.forEach(function (blog, index) {
    const preview = blog.content.length > 220 ? blog.content.slice(0, 220) + '...' : blog.content;
    blogDataById.set(String(blog.id), blog);

    blogsContainer.innerHTML +=
      "<li class='blog-post-item'>" +
        "<div class='blog-content blog-sequence-card'>" +
          "<span class='blog-seq-badge'>#" + (index + 1) + "</span>" +
          "<div class='blog-meta'>" +
            "<p class='blog-category'>" + escapeHtml(blog.category) + "</p>" +
            "<span class='dot'></span>" +
            "<time>" + formatDate(blog.timestamp) + "</time>" +
          "</div>" +
          "<h3 class='h3 blog-item-title'>" +
            "<button class='blog-open-btn' type='button' data-blog-open-id='" + blog.id + "'>" +
              escapeHtml(blog.title) +
            "</button>" +
          "</h3>" +
          "<p class='blog-text'>" + escapeHtml(preview).replace(/\n/g, '<br>') + "</p>" +
          "<button class='blog-read-btn' type='button' data-blog-open-id='" + blog.id + "'>Read Full</button>" +
        "</div>" +
      "</li>";
  });
}

if (blogsContainer) {
  renderBlogs();

  blogsContainer.addEventListener('click', function (event) {
    const openTrigger = event.target.closest('[data-blog-open-id]');
    if (!openTrigger) return;
    openBlogModal(openTrigger.getAttribute('data-blog-open-id'));
  });
}

if (blogModalCloseBtn) {
  blogModalCloseBtn.addEventListener('click', closeBlogModal);
}

if (blogModal) {
  blogModal.addEventListener('click', function (event) {
    if (event.target === blogModal) {
      closeBlogModal();
    }
  });
}

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    closeBlogModal();
  }
});

const postsContainer = document.getElementById('postsContainer');

function renderRoutinePosts() {
  if (!postsContainer) return;

  const posts = Array.isArray(window.PORTFOLIO_ROUTINE_POSTS) ? window.PORTFOLIO_ROUTINE_POSTS : [];
  postsContainer.innerHTML = '';

  if (posts.length === 0) {
    postsContainer.innerHTML = "<div class='empty-state'><p>No routine updates added yet.</p></div>";
    return;
  }

  posts.forEach(function (post) {
    let repliesHtml = '';

    if (Array.isArray(post.replies) && post.replies.length > 0) {
      repliesHtml = "<div class='replies-container'>";

      post.replies.forEach(function (reply) {
        repliesHtml +=
          "<div class='reply-item'>" +
            "<div class='reply-time'>" + formatTime(reply.timestamp) + "</div>" +
            "<div class='reply-text'>" + escapeHtml(reply.message) + "</div>" +
          "</div>";
      });

      repliesHtml += '</div>';
    }

    postsContainer.innerHTML +=
      "<div class='post-card'>" +
        "<div class='post-header'>" +
          "<div class='post-time'>" + formatTime(post.timestamp) + "</div>" +
        "</div>" +
        "<div class='post-message'>" + escapeHtml(post.message) + "</div>" +
        repliesHtml +
      "</div>";
  });
}

if (postsContainer) {
  renderRoutinePosts();
}

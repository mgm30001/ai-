// 这个可选文件用于为PWA服务工作者提供额外的配置
// 有关详细信息，请参阅 https://create-react-app.dev/docs/making-a-progressive-web-app/

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export function register(config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // URL构造函数在所有浏览器中都可用
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // 如果PUBLIC_URL不在与我们的源相同的源上，则我们的服务工作者不会工作
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // 这正在本地运行，让我们检查服务工作者是否仍然存在
        checkValidServiceWorker(swUrl, config);

        // 向开发人员添加一些额外的日志记录，表明服务工作者
        // 准备好了或没有准备好
        navigator.serviceWorker.ready.then(() => {
          console.log('此Web应用程序正在通过服务工作者缓存服务。');
        });
      } else {
        // 这不是本地的，就直接注册服务工作者
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // 在这个点上，更新的预缓存内容已被获取，
              // 但以前的服务工作者将继续提供旧内容
              // 直到所有客户端标签都关闭。
              console.log('新内容可用并将在所有标签关闭时使用。');

              // 执行回调
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // 在这一点上，所有内容都已预缓存。
              // 这是当你想显示一个
              // "已缓存以供离线使用"的消息的完美时间。
              console.log('内容已缓存以供离线使用。');

              // 执行回调
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('服务工作者注册期间出错：', error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  // 检查我们是否可以找到服务工作者。如果我们不能重新加载页面。
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // 确保服务工作者存在并且我们真的得到了JS文件。
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // 没有找到服务工作者。可能是一个不同的应用。重新加载页面。
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // 找到了服务工作者。正常处理。
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('未找到互联网连接。应用正在离线模式下运行。');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
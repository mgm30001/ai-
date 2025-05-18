# AIu5c0fu8bf4u751fu6210u5e94u7528

u4e00u4e2au57fau4e8eAIu7684u5c0fu8bf4u521bu4f5cu4e0eu4ea4u4e92u5e73u53f0u3002

## u9879u76eeu7ed3u6784

- `/frontend` - Reactu524du7aefu5e94u7528
- `/backend` - Flasku540eu7aefu670du52a1

## u5f00u53d1u73afu5883u8bbeu7f6e

### u540eu7aefu8bbeu7f6e

```bash
cd backend
pip install -r requirements.txt
python app.py
```

u540eu7aefu670du52a1u5c06u5728 http://localhost:5001 u8fd0u884c

### u524du7aefu8bbeu7f6e

```bash
cd frontend
npm install
npm start
```

u524du7aefu670du52a1u5c06u5728 http://localhost:3000 u8fd0u884c

## u90e8u7f72u6307u5357

### u540eu7aefu90e8u7f72

1. u5728Herokuu4e0au90e8u7f72uff1a

```bash
heroku create
git push heroku main
```

2. u5728Railwayu4e0au90e8u7f72uff1a
   - u8fdeu63a5u4f60u7684GitHubu4ed3u5e93
   - u6307u5b9au542fu52a8u547du4ee4uff1a`gunicorn app:app`
   - u6dfbu52a0u73afu5883u53d8u91cfuff1a`AISTUDIO_API_KEY` u7b49

### u524du7aefu90e8u7f72

1. u6784u5efau524du7aefuff1a

```bash
cd frontend
npm run build
```

2. u90e8u7f72u5230Netlify/Verceluff1a
   - u5bfcu5165GitHubu4ed3u5e93
   - u6307u5b9au6784u5efau547du4ee4uff1a`cd frontend && npm install && npm run build`
   - u6307u5b9au8f93u51fau76eeu5f55uff1a`frontend/build`
   - u8bbeu7f6eu73afu5883u53d8u91cfuff1a`REACT_APP_API_URL`u4e3au540eu7aefu5730u5740

## u6ce8u610fu4e8bu9879

- u786eu4fddu540eu7aefu7684CORSu8bbeu7f6eu6b63u786euff0cu5141u8bb8u524du7aefu57dfu540du8bbfu95ee
- u5728u751fu4ea7u73afu5883u4e2du9700u4fddu62a4APIu5bc6u94a5u5b89u5168uff0cu4f7fu7528u73afu5883u53d8u91cf
- u5982u679cu4f7fu7528u81eau5b9au4e49u57dfu540duff0cu8bf7u6b63u786eu8bbeu7f6eu57dfu540du548cDNSu8bb0u5f55
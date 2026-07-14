FROM nginx:alpine
COPY . /usr/share/nginx/html
# small: mp4s served with range support (nginx does this by default)
EXPOSE 80

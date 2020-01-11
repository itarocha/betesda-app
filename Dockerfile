#Stage 1
FROM node:8 as react-build
WORKDIR /app
COPY . ./
RUN yarn
RUN yarn build

#Stage 2 - the production environment
FROM nginx:alpine
#COPY betesda.conf /etc/nginx/sites-available/betesda.conf
COPY betesda.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /app/dist /app/betesda
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
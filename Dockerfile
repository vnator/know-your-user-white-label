FROM node:18
WORKDIR /usr/app
COPY ./ ./
RUN npx yarn install
RUN npm run build
EXPOSE 3000
CMD [ "node", "dist/src" ]

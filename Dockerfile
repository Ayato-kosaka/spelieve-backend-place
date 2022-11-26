# syntax=docker/dockerfile:1
FROM node:16
# ビルドには devDependencies もインストールする必要があるため
RUN npm i -g @nestjs/cli
WORKDIR /workspace
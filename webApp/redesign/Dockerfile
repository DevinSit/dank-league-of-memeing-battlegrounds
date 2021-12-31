FROM node:15

ENV NPM_CONFIG_LOGLEVEL warn
ENV NEXT_TELEMETRY_DISABLED=1

ARG app_env
ARG branch

ENV NODE_ENV $app_env
ENV BRANCH $branch

RUN mkdir -p /redesign && chown node /redesign
USER node
WORKDIR /redesign

COPY --chown=node:node package.json package-lock.json ./
RUN npm ci

COPY --chown=node:node . .
RUN npm run build

EXPOSE 3000

CMD ["./scripts/run.sh"]

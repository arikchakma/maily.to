# Spotable Maily.to

Spotable Maily.to is forked from [arikchakma/maily.to](https://github.com/arikchakma/maily.to) to make it possible to only render the email template and not send it.

## Development

1. Clone the repository: `git clone git@github.com:Databoy9000/maily.to.git`
2. Change directory: `cd maily.to`
3. Copy the example config file: `cp ./apps/web/.env.example ./apps/web/.env`
4. Install all the dependencies: `pnpm install`
5. Start the development server: `pnpm dev`
   - :exclamation: Wait until the `maily-core:dev` build has successfully completed before opening the browser
6. Open the browser and go to <http://localhost:3002>
   - Swagger UI: <http://localhost:3002/api/v1>
   - Swagger JSON: <http://localhost:3002/api/v1/swagger.json>

## License

MIT &copy; [Arik Chakma](https://twitter.com/imarikchakma)

## PROJECT STRUCTURE

app: for the routes
auth: config nextauth & auth session using next-auth
components: containing custom components and component UI (using Shadcn)
config: some config about the project
contexts: make some providers 
lib: containing some library or custom library
services: contact with the API 
stores: saving store to use in another components (using zustand)
types: defining the type of the response or others 
.env.example: the example key of env (to remember how many key are there)


## HOW TO RUN
```bash
First, git clone it
Second, cd into the folder 

Then run:
npm i (to install the packages)

Finally,
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

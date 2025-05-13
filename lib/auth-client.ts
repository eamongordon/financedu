import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";
 
const authOptions = {
  plugins: [inferAdditionalFields<typeof auth>()],
};

export const authClient = createAuthClient(authOptions);

export const { signIn, signUp, useSession } = createAuthClient(authOptions);
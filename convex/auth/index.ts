import { auth } from "@convex-dev/auth/convex.config"
import { password } from "@convex-dev/auth/password"

export default auth({
  providers: [
    password({
      profileFields: ["englishName", "username", "organization", "cohort", "studentId"],
    }),
  ],
})

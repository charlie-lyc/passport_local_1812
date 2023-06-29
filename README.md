# Passport Authentication

```

[Client]                [Server]                            [Passport]                                      [Database]              [Cookie-Session]
        - POST /login ->        - passport.authenticate() ->            ------- findUser(username) ------->
                                                                        <----------- return user ----------
                                                                    - validatePassword(password, user.password)->
                            <- return user if validation successful     <---- return validation result ----


                            ---------------------------------- serialize user to get user.id when logged in ------------------------------->
                            <------------------------ deserialize user.id to get user object with req.session.user -------------------------
        <- return 200 OK -
    with Set-Cookie header
```
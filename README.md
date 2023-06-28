# Passport Authentication

```

[Client]                [Server]                            [Passport]                                      [Database]              [Cookie-Session]
        - POST /login ->        - passport.authenticate() ->            ------- findUser(username) ------->

                                                                        <----------- return user ----------

                                                                    - validatePassword(password, user.password)->

                            <- return user if validation successful     <---- return validation result ----

                            ---------------------------------------- store user in req.session.user ---------------------------------------->

                            <------------------------------------- serialize, encrypt, and sign session -------------------------------------

        <- return 200 OK -
    with Set-Cookie header
    
```
# sporcle_customize
Javascript to inject into Sporcle game pages to help you choose what kind of quizzes to play

Replaces some of the Sporcle page with a list of other quizzes. The titles of these quizzes do not contain any of a list of keywords you define.

For example, I don't want sports quizzes, so I exclude ones that have "nfl", "mlb", "nhl", and "nba" in their titles. I also exclude quizzes whose titles contain "scramble", because I don't like them.

The exclusion strings should be lower case.

The list also tells you what your previous score on that quiz is, and when you last played it (if ever).

Some JS injection browser plugins inject it before jQuery is available. In that case, work with the plugin to load your own version of jQuery.

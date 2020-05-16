/*
 * Extract the title of a quiz from the quiz page's HTML
 *
 * @param string pageHTML
 * @return string
 */
function getQuizTitle(pageHTML) {
    const regex = /<h2>([^<]+)<\/h2/;
    return pageHTML.match(regex)[1];
}

/*
 * Extract the Game (quiz) ID from a quiz page's HTML
 *
 * @param string pageHTML The HTML of the quiz page
 * @return string The GameID of the quiz
 */
function getGameID(pageHTML) {
    const regex = /Sporcle.gameData = {\s*gameID\s*: ([0-9]+),/;
    return pageHTML.match(regex)[1];
}

/**
 * Check a title for any strings that we DON'T want in our quizzes
 *
 * @title string The title of the quiz we are looking at
 * @return bool true if there are unwanted strings, false if we like this title
 */
function checkForBadWords(title) {
    const lcTitle = title.toLowerCase();
    const badWords = ['scramble', 'nfl', 'mlb', 'nhl', 'nba', 'ladder'];

    for (const bWord of badWords) {
        if (lcTitle.indexOf(bWord) > -1) {
            return true;
        }
    }
    return false;
}

/*
 * Get up to 5 quizzes and put links to them in a box of the current page
 *
 */
function getGoodQuiz() {
    let goodQuiz = false;

    // We don't care about the current contents of #headerBox, it's a convenient place to put our links
    jQuery('#headerBox').html('');
    jQuery('.IMGgi').remove();

    // Get at most 5 additional quizzes to display for the user
    for (let i = 0; i < 5; i++) {
        // Get a random quiz
        // Use fetch, because random.php returns a HTTP 302 response which normally forces the browser to redirect
        // fetch will get the response and we can read the URL of the random quiz from it
        fetch('https://www.sporcle.com/games/random.php')
            .then(res => {
                // Get the HTML for the additional quiz
                fetch(res.url)
                    .then(pgRes => pgRes.text())
                    .then(pgHtml => {
                        // Parse the HTML for the title and game ID of the additional quiz
                        const title = getQuizTitle(pgHtml);
                        const gameID = getGameID(pgHtml);
                
                        if (!checkForBadWords(title)) {
                            // The title doesn't have any of the words we dislike, so use this additional quiz
                            const scoreURL = 'https://www.sporcle.com/games/ajax/friends_scores.php';
                            const params = {
                                game: gameID,
                                mode: 'highscores',
                                all: "false",
                                new: "true"
                            };
                            // Get the stats for this additional quiz (I have no friends, so mine is the only entry)
                            jQuery.post(scoreURL, params, function(data) {
                                let score = "0/" + data.num_answers;
                                if (data.scores.length > 0) {
                                    score = data.scores[0].best_score_num + "/" + data.num_answers
                                        + ": " + data.scores[0].play_date;
                                }
                                // Add this additional quiz into the #headerBox, which we don't need the original contents of
                                jQuery('#headerBox')
                                    .append('<p><a href="' + res.url + '">' + title + '</a> (' + score + ')</p>');
                            });
                        } else {
                            // This quiz isn't one we want
                            console.log("Not good: " + title);
                        }
                    });
            });
    }

}

getGoodQuiz();

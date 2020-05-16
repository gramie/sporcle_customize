function getQuizTitle(pageHTML) {
    const regex = /<h2>([^<]+)<\/h2/;
    return pageHTML.match(regex)[1];
}

function getGameID(pageHTML) {
    const regex = /Sporcle.gameData = {\s*gameID\s*: ([0-9]+),/;
    return pageHTML.match(regex)[1];
}

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

function getGoodQuiz() {
    let goodQuiz = false;

    jQuery('#headerBox').html('');

    for (let i = 0; i < 5; i++) {
        fetch('https://www.sporcle.com/games/random.php')
            .then(res => {
                fetch(res.url)
                    .then(pgRes => pgRes.text())
                    .then(pgHtml => {
                        const title = getQuizTitle(pgHtml);
                        const gameID = getGameID(pgHtml);
                
                        if (!checkForBadWords(title)) {
                            const scoreURL = 'https://www.sporcle.com/games/ajax/friends_scores.php';
                            const params = {
                                game: gameID,
                                mode: 'highscores',
                                all: "false",
                                new: "true"
                            };
                            jQuery.post(scoreURL, params, function(data) {
                                let score = "0/" + data.num_answers;
                                if (data.scores.length > 0) {
                                    score = data.scores[0].best_score_num + "/" + data.num_answers
                                        + ": " + data.scores[0].play_date;
                                    console.log(data.scores[0]);
                                }
                                jQuery('#headerBox')
                                    .append('<p><a href="' + res.url + '">' + title + '</a> (' + score + ')</p>');
                            });
                        } else {
                            console.log("Not good: " + title);
                        }
                    });
            });
    }

}

getGoodQuiz();

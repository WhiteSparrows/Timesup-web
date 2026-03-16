// Liste de mots prédéfinis
const WORDS_LIST = [
    'Chien', 'Chat', 'Maison', 'Arbre', 'Voiture', 'Soleil', 'Lune', 'Étoile',
    'Piano', 'Guitare', 'Cinéma', 'Livre', 'Stylo', 'Crayon', 'Papier', 'Table',
    'Chaise', 'Lit', 'Fenêtre', 'Porte', 'Clé', 'Serrure', 'Lampe', 'Ampoule',
    'Téléphone', 'Ordinateur', 'Souris', 'Clavier', 'Écran', 'Caméra', 'Photo', 'Vidéo',
    'Montagne', 'Rivière', 'Plage', 'Désert', 'Forêt', 'Jungle', 'Océan', 'Lac',
    'Nuage', 'Pluie', 'Neige', 'Vent', 'Tonerre', 'Arc-en-ciel', 'Saison', 'Automne',
    'Hiver', 'Printemps', 'Été', 'Jour', 'Nuit', 'Matin', 'Soir', 'Minuit',
    'Pomme', 'Orange', 'Banane', 'Fraise', 'Raisin', 'Citron', 'Avocat', 'Brocoli',
    'Carotte', 'Tomate', 'Oignon', 'Ail', 'Fromage', 'Pain', 'Lait', 'Beurre',
    'Eau', 'Jus', 'Café', 'Thé', 'Chocolat', 'Gâteau', 'Biscuit', 'Bonbon',
    'Pizza', 'Hamburger', 'Salade', 'Soupe', 'Pâtes', 'Riz', 'Poisson', 'Poulet',
    'Viande', 'Œuf', 'Restaurant', 'Cuisine', 'Recette', 'Cuillère', 'Fourchette',
    'Couteau', 'Assiette', 'Verre', 'Tasse', 'Bouteille', 'Pot', 'Casserole', 'Poêle',
    'Sport', 'Football', 'Basket', 'Tennis', 'Golf', 'Natation', 'Ski', 'Boxe',
    'Danse', 'Musique', 'Chanson', 'Orchestre', 'Concert', 'Théâtre', 'Acteur', 'Artiste',
    'Peinture', 'Sculpture', 'Statue', 'Musée', 'Galerie', 'Exposition', 'Couleur', 'Rouge',
    'Bleu', 'Vert', 'Jaune', 'Violet', 'Rose', 'Noir', 'Blanc',
    'Gris', 'Marron', 'Nombre', 'Lettre', 'Alphabet', 'Mot', 'Phrase', 'Histoire',
    'Conte', 'Fable', 'Légende', 'Mythe', 'Religion', 'Magie', 'Rêve', 'Cauchemar',
    'Aventure', 'Mystère', 'Énigme', 'Jeu', 'Jouet', 'Poupée', 'Robot', 'Voilier'
];

const ROUND_RULES = [
    'Décrivez le mot avec des phrases (pas le mot lui-même)',
    'Décrivez le mot avec un seul mot',
    'Mimez le mot (pas de parole)'
];

// État du jeu
let gameState = {
    currentRound: 1,
    words: [],
    foundWords: [],
    unfoundWords: [],
    currentWordIndex: 0,
    currentTeam: 1,
    team1Score: 0,
    team2Score: 0,
    turnScores: { 1: 0, 2: 0 },
    isTimerRunning: false,
    timeRemaining: 60,
    wordCount: 0
};

// DOM Elements
const homeScreen = document.getElementById('homeScreen');
const gameScreen = document.getElementById('gameScreen');
const turnEndScreen = document.getElementById('turnEndScreen');
const roundEndScreen = document.getElementById('roundEndScreen');
const endScreen = document.getElementById('endScreen');

const startBtn = document.getElementById('startBtn');
const wordCountInput = document.getElementById('wordCount');
const foundBtn = document.getElementById('foundBtn');
const skipBtn = document.getElementById('skipBtn');
const endRoundBtn = document.getElementById('endRoundBtn');
const continueBtn = document.getElementById('continueBtn');
const nextRoundBtn = document.getElementById('nextRoundBtn');
const restartBtn = document.getElementById('restartBtn');

// Event Listeners
startBtn.addEventListener('click', startGame);
foundBtn.addEventListener('click', foundWord);
skipBtn.addEventListener('click', skipWord);
endRoundBtn.addEventListener('click', endTurn);
continueBtn.addEventListener('click', continueTurn);
nextRoundBtn.addEventListener('click', nextRound);
restartBtn.addEventListener('click', restartGame);

function startGame() {
    const count = parseInt(wordCountInput.value);
    if (count < 5 || count > 50) {
        alert('Veuillez choisir entre 5 et 50 mots');
        return;
    }

    gameState.wordCount = count;
    gameState.words = shuffleArray(WORDS_LIST).slice(0, count);
    gameState.foundWords = [];
    gameState.currentRound = 1;
    gameState.currentTeam = 1;
    gameState.team1Score = 0;
    gameState.team2Score = 0;

    showScreen(gameScreen);
    startRound();
}

function startRound() {
    gameState.foundWords = [];
    gameState.unfoundWords = [...gameState.words];
    gameState.currentTeam = 1;
    gameState.turnScores = { 1: 0, 2: 0 };

    updateRoundDisplay();
    startTurn();
}

function startTurn() {
    gameState.turnScores[gameState.currentTeam] = 0;
    gameState.currentWordIndex = 0;

    // Vérifier si tous les mots sont trouvés
    if (gameState.foundWords.length >= gameState.words.length) {
        endRound();
    } else {
        displayNextWord();
        startTimer();
    }
}

function startTimer() {
    gameState.timeRemaining = 60;
    gameState.isTimerRunning = true;

    const timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        updateTimerDisplay();

        if (gameState.timeRemaining <= 0) {
            clearInterval(timerInterval);
            gameState.isTimerRunning = false;
            endTurn();
        }
    }, 1000);

    gameState.timerInterval = timerInterval;
}

function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timerDisplay');
    const timerElement = document.querySelector('.timer');

    timerDisplay.textContent = gameState.timeRemaining;

    timerElement.classList.remove('warning', 'danger');
    if (gameState.timeRemaining <= 10 && gameState.timeRemaining > 5) {
        timerElement.classList.add('warning');
    } else if (gameState.timeRemaining <= 5) {
        timerElement.classList.add('danger');
    }
}

function updateRoundDisplay() {
    document.getElementById('roundNumber').textContent = gameState.currentRound;
    document.getElementById('roundRule').textContent = ROUND_RULES[gameState.currentRound - 1];
    document.getElementById('currentTeamName').textContent = `Équipe ${gameState.currentTeam}`;

    updateScoresDisplay();
}

function displayNextWord() {
    // Recalculer les mots non trouvés
    gameState.unfoundWords = gameState.words.filter(w => !gameState.foundWords.includes(w));

    if (gameState.unfoundWords.length > 0 && gameState.currentWordIndex < gameState.unfoundWords.length) {
        const word = gameState.unfoundWords[gameState.currentWordIndex];
        document.getElementById('currentWord').textContent = word;
        foundBtn.disabled = false;
        skipBtn.disabled = false;
    } else {
        foundBtn.disabled = true;
        skipBtn.disabled = true;
    }
}

function foundWord() {
    if (!gameState.isTimerRunning) return;

    // Recalculer les mots non trouvés pour avoir la liste à jour
    gameState.unfoundWords = gameState.words.filter(w => !gameState.foundWords.includes(w));

    if (gameState.unfoundWords.length === 0) return;

    const word = gameState.unfoundWords[gameState.currentWordIndex];
    gameState.foundWords.push(word);
    gameState.turnScores[gameState.currentTeam]++;
    gameState.team1Score += gameState.currentTeam === 1 ? 1 : 0;
    gameState.team2Score += gameState.currentTeam === 2 ? 1 : 0;

    updateScoresDisplay();

    // Vérifier si tous les mots sont trouvés
    if (gameState.foundWords.length >= gameState.words.length) {
        endTurn();
    } else {
        // Chercher le prochain mot non trouvé après celui-ci
        gameState.unfoundWords = gameState.words.filter(w => !gameState.foundWords.includes(w));
        gameState.currentWordIndex = 0; // Recommencer à partir du début de la nouvelle liste
        displayNextWord();
    }
}

function skipWord() {
    if (!gameState.isTimerRunning) return;

    // Recalculer les mots non trouvés pour avoir la liste à jour
    gameState.unfoundWords = gameState.words.filter(w => !gameState.foundWords.includes(w));

    if (gameState.unfoundWords.length === 0) return;

    gameState.currentWordIndex++;

    // Boucler si on atteint la fin de la liste
    if (gameState.currentWordIndex >= gameState.unfoundWords.length) {
        gameState.currentWordIndex = 0;
    }

    displayNextWord();
}

function endTurn() {
    clearInterval(gameState.timerInterval);
    gameState.isTimerRunning = false;
    foundBtn.disabled = false;
    skipBtn.disabled = false;

    // Vérifier si tous les mots sont trouvés
    if (gameState.foundWords.length >= gameState.words.length) {
        endRound();
    } else {
        showTurnEnd();
    }
}

function showTurnEnd() {
    const nextTeam = gameState.currentTeam === 1 ? 2 : 1;
    document.getElementById('turnInfo').textContent =
        `Équipe ${gameState.currentTeam} a marqué ${gameState.turnScores[gameState.currentTeam]} point(s) ce tour`;
    document.getElementById('turnTeam1Score').textContent = gameState.team1Score;
    document.getElementById('turnTeam2Score').textContent = gameState.team2Score;
    document.getElementById('nextTeamMessage').textContent =
        `À Équipe ${nextTeam} de jouer!`;

    showScreen(turnEndScreen);
}

function continueTurn() {
    // Passer à l'autre équipe
    gameState.currentTeam = gameState.currentTeam === 1 ? 2 : 1;
    showScreen(gameScreen);
    startTurn();
}

function endRound() {
    showScreen(roundEndScreen);
    document.getElementById('roundEndTeam1').textContent = `${gameState.team1Score} points`;
    document.getElementById('roundEndTeam2').textContent = `${gameState.team2Score} points`;

    updateScoresDisplay();
}

function nextRound() {
    gameState.currentRound++;

    if (gameState.currentRound > 3) {
        endGame();
    } else {
        showScreen(gameScreen);
        startRound();
    }
}

function endGame() {
    showScreen(endScreen);

    document.getElementById('finalTeam1').textContent = gameState.team1Score;
    document.getElementById('finalTeam2').textContent = gameState.team2Score;

    let winnerText = '';
    if (gameState.team1Score > gameState.team2Score) {
        winnerText = '🎉 Équipe 1 remporte la victoire!';
    } else if (gameState.team2Score > gameState.team1Score) {
        winnerText = '🎉 Équipe 2 remporte la victoire!';
    } else {
        winnerText = '⚖️ Égalité parfaite!';
    }

    document.getElementById('winnerText').textContent = winnerText;
}

function updateScoresDisplay() {
    const team1ScoreEl = document.getElementById('team1Score');
    const team2ScoreEl = document.getElementById('team2Score');

    team1ScoreEl.querySelector('.score').textContent = gameState.team1Score;
    team2ScoreEl.querySelector('.score').textContent = gameState.team2Score;
}

function restartGame() {
    showScreen(homeScreen);
    gameState = {
        currentRound: 1,
        words: [],
        foundWords: [],
        unfoundWords: [],
        currentWordIndex: 0,
        currentTeam: 1,
        team1Score: 0,
        team2Score: 0,
        turnScores: { 1: 0, 2: 0 },
        isTimerRunning: false,
        timeRemaining: 60,
        wordCount: 0
    };
    foundBtn.disabled = false;
    skipBtn.disabled = false;
}

function showScreen(screen) {
    homeScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    turnEndScreen.classList.add('hidden');
    roundEndScreen.classList.add('hidden');
    endScreen.classList.add('hidden');

    screen.classList.remove('hidden');
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

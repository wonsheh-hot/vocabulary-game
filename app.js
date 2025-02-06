import { wordList } from './words.js';  
 
class MemoryGame { 
  constructor(words) { 
    this.words  = words; 
    this.currentWord  = null; 
    this.mode  = null; 
    this.score  = 0; 
    this.achievements  = []; 
    this.reviewWords  = []; 
    
    // Prevent consecutive words by tracking more robust previous word tracking 
    this.excludedWords  = new Set(); 
    
    // DOM Elements 
    this.wordDisplay  = document.getElementById('word-display');  
    this.hintDisplay  = document.getElementById('hint');  
    this.optionsDisplay  = document.getElementById('options');  
    this.feedbackDisplay  = document.getElementById('feedback');  
    this.scoreDisplay  = document.getElementById('score-display');  
    this.progressBar  = document.getElementById('progress-bar');  
    this.achievementsContainer  = document.getElementById('achievements-container');  
    
    this.studentId  = ''; 
    this.studentName  = ''; 
    
    // Modals 
    this.studentModal  = document.getElementById('student-modal');  
    this.studentDisplay  = document.getElementById('student-display');  
    this.gameEndModal  = document.getElementById('game-end-modal');  
    this.endStudentInfo  = document.getElementById('end-student-info');  
    this.endScoreDisplay  = document.getElementById('end-score-display');  
    this.endAchievements  = document.getElementById('end-achievements');  
    
    // Timer properties 
    this.questionTimer  = null; 
    this.questionTimeLimit  = 15; // 15 seconds to answer 
    this.timerDisplay  = null; 
    
    // Prevent multiple event listeners 
    this.setupEventListeners();  
    
    this.initLocalStorage();  
  } 
 
  setupEventListeners() { 
    const startGameBtn = document.getElementById('start-game-btn');  
    const restartGameBtn = document.getElementById('restart-game-btn');  
    const startReviewBtn = document.getElementById('start-review');  
 
    // Add event listeners 
    startGameBtn.addEventListener('click',  () => this.startGame());  
    restartGameBtn.addEventListener('click',  () => this.resetGame());  
    startReviewBtn.addEventListener('click',  () => this.startReviewMode());  
  } 
 
  startGame() { 
    const studentIdInput = document.getElementById('student-id');  
    const studentNameInput = document.getElementById('student-name');  
    const studentId = studentIdInput.value.trim();  
    const studentName = studentNameInput.value.trim();  
 
    if (studentId.length  === 5 && studentName) { 
      this.studentId  = studentId; 
      this.studentName  = studentName; 
      this.studentModal.style.display  = 'none'; 
      document.getElementById('app').style.display  = 'block'; 
      this.studentDisplay.textContent  = `${this.studentId}  - ${this.studentName}`;  
      
      // Reset game state 
      this.score  = 0; 
      this.achievements  = []; 
      this.scoreDisplay.textContent  = '🏆 0'; 
      this.progressBar.style.width  = '0%'; 
      this.achievementsContainer.innerHTML  = ''; 
      this.excludedWords.clear();  
 
      this.setupReviewReminder();  
      this.start();  
    } else { 
      alert('请输入正确的学号（5位数）和姓名'); 
    } 
  } 
 
  resetGame() { 
    this.gameEndModal.style.display  = 'none'; 
    this.studentModal.style.display  = 'flex'; 
    document.getElementById('app').style.display  = 'none'; 
    
    // Reset game state 
    this.score  = 0; 
    this.achievements  = []; 
    this.scoreDisplay.textContent  = '🏆 0'; 
    this.progressBar.style.width  = '0%'; 
    this.achievementsContainer.innerHTML  = ''; 
    this.excludedWords.clear();  
  } 
 
  start() { 
    // Clear any existing listeners and timer 
    this.clearQuestionTimer();  
    this.optionsDisplay.innerHTML  = ''; 
    this.hintDisplay.textContent  = ''; 
    this.feedbackDisplay.textContent  = ''; 
 
    // Comprehensive word selection strategy 
    const availableWords = this.words.filter(word  => 
     !this.excludedWords.has(word.en)  && 
      word.en.length  > 3 
    ); 
 
    // Sort by wrong count if applicable 
    const priorityWords = availableWords 
     .sort((a, b) => b.wrongCount  - a.wrongCount)  
     .slice(0, Math.min(availableWords.length,  10)); 
 
    // Select a random word from priority words 
    this.currentWord  = priorityWords[Math.floor(Math.random() * priorityWords.length)];  
    
    // Mark current word as used 
    this.excludedWords.add(this.currentWord.en);  
    
    // Reset if all words have been used 
    if (this.excludedWords.size  >= this.words.length)  { 
      this.excludedWords.clear();  
    } 
 
    this.selectRandomMode();  
    this.render();  
  } 
 
  setupReviewReminder() { 
    const reviewInterval = 30 * 60 * 1000; // 30 minutes 
    setInterval(() => this.checkReviewReminder(),  reviewInterval); 
  } 
 
  checkReviewReminder() { 
    const needReview = this.words.filter(word  => 
      Date.now()  >= word.nextReview  
    ); 
    
    if (needReview.length  > 0) { 
      this.showReviewReminder(needReview);  
    } 
  } 
 
  showReviewReminder(words) { 
    const reminderEl = document.getElementById('review-reminder');  
    reminderEl.style.display  = 'flex'; 
    
    const startReviewBtn = document.getElementById('start-review');  
    startReviewBtn.onclick  = () => { 
      this.reviewWords  = words; 
      reminderEl.style.display  = 'none'; 
      this.startReview();  
    }; 
  } 
 
  startReview() { 
    // Implement review mode with prioritized words 
    if (this.reviewWords.length  > 0) { 
      this.currentWord  = this.reviewWords.shift();  
      this.render();  
    } else { 
      this.start();  
    } 
  } 
 
  selectRandomMode() { 
    this.mode  = Math.random()  > 0.5? 'EN_TO_ZH' : 'ZH_TO_EN'; 
  } 
 
  updateWordMemoryStep(isCorrect) { 
    const now = Date.now();  
    const intervals = [5*60*1000, 25*60*1000, 2*24*60*60*1000, 7*24*60*60*1000]; 
 
    if (isCorrect) { 
      this.currentWord.step  = Math.min(this.currentWord.step  + 1, intervals.length  - 1); 
      this.currentWord.nextReview  = now + intervals[this.currentWord.step]; 
    } else { 
      this.currentWord.step  = 0; 
      this.currentWord.wrongCount++;  
      this.currentWord.nextReview  = now + intervals[0]; 
    } 
 
    this.saveProgress();  
  } 
 
  render() { 
    try { 
      if (this.mode  === 'EN_TO_ZH') { 
        this.renderEnToZh();  
      } else { 
        this.renderZhToEn();  
      } 
    } catch (error) { 
      console.error('Rendering  error:', error); 
      this.start();  // Restart if rendering fails 
    } 
  } 
 
  renderEnToZh() { 
    // Ensure the selected word is different from the previous word 
    const availableWords = this.words  
     .filter(word => word!== this.currentWord);  
    
    this.wordDisplay.textContent  = this.currentWord.en;  
    const wrongOptions = this.generateWrongZhOptions();  
    const options = this.shuffleArray([...wrongOptions,  this.currentWord.zh]);  
 
    this.optionsDisplay.innerHTML  = options.map(option  => 
      `<button class="option">${option}</button>` 
    ).join(''); 
 
    this.startQuestionTimer();  
    this.bindOptionListeners((selectedOption)  => { 
      this.clearQuestionTimer();  
      if (selectedOption === this.currentWord.zh)  { 
        this.showFeedback(' 正确！', true); 
      } else { 
        this.showFeedback(' 错误，正确答案是：' + this.currentWord.zh,  false); 
      } 
      setTimeout(() => this.start(),  2000); 
    }); 
  } 
 
  renderZhToEn() { 
    // Ensure the selected word is different from the previous word and long enough 
    const availableWords = this.words  
     .filter(word => 
        word!== this.currentWord  && 
        word.en.length  > 3 
      ); 
    
    this.wordDisplay.textContent  = this.currentWord.zh;  
    
    const maskedWord = this.maskWord(this.currentWord.en);  
    this.hintDisplay.textContent  = maskedWord; 
 
    const missingLetters = this.extractMissingLetters(this.currentWord.en,  maskedWord); 
    const wrongOptions = this.generatePhoneticWrongOptions(missingLetters);  
    const options = this.shuffleArray([...wrongOptions,  missingLetters]); 
 
    this.optionsDisplay.innerHTML  = options.map(option  => 
      `<button class="option">${option.join(',')}</button>`  
    ).join(''); 
 
    this.startQuestionTimer();  
    this.bindOptionListeners((selectedOption)  => { 
      this.clearQuestionTimer();  
      const selectedLetters = selectedOption.split(',');  
      if (this.compareLetters(selectedLetters,  missingLetters)) { 
        this.showFeedback(' 正确！', true); 
      } else { 
        this.showFeedback(' 错误，正确答案是：' + missingLetters.join(','),  false); 
      } 
      setTimeout(() => this.start(),  2000); 
    }); 
  } 
 
  generatePhoneticWrongOptions(correctLetters) { 
    const phoneticallyRelatedSets = { 
      'a': ['e', 'o', 'u'], 
      'e': ['a', 'i', 'y'], 
      'i': ['e', 'y'], 
      'o': ['a', 'u'], 
      'u': ['o', 'a'], 
      'r': ['w', 'l'], 
      'l': ['r', 'w'], 
      'h': ['k', 'g'], 
      'k': ['h', 'g'] 
    }; 
 
    const wrongOptions = []; 
    while (wrongOptions.length  < 3) { 
      const option = correctLetters.map(letter  => { 
        // Try to find phonetically similar letters 
        const relatedLetters = phoneticallyRelatedSets[letter.toLowerCase()] || []; 
        const similarLetter = relatedLetters.length  > 0 
         ? relatedLetters[Math.floor(Math.random() * relatedLetters.length)]  
          : this.getRandomLetter(letter);  
        return similarLetter || letter; 
      }); 
 
      // Ensure the option is different from correct and previous options 
      if (!this.compareLetters(option,  correctLetters) && 
         !wrongOptions.some(opt  => this.compareLetters(opt,  option))) { 
        wrongOptions.push(option);  
      } 
    } 
 
    return wrongOptions; 
  } 
 
  generateWrongZhOptions() { 
    const excludedWords = new Set(); 
    
    const wordSimilarities = [ 
      // Semantic context similarities 
      word => { 
        const currentMeanings = this.currentWord.zh.split(' ；'); 
        const wordMeanings = word.zh.split(' ；'); 
        return currentMeanings.some(m  => 
          wordMeanings.some(wm  => 
            wm.includes(m.substring(0,  2)) || 
            this.calculateStringSimilarity(m,  wm) > 0.4 
          ) 
        ); 
      }, 
      // Character similarity 
      word => { 
        const charOverlap = this.currentWord.zh.split('').filter(char  => 
          word.zh.includes(char)  
        ).length; 
        return charOverlap > 1; 
      } 
    ]; 
 
    const generateWrongOption = () => { 
      const candidates = this.words.filter(word  => 
        word.zh!==  this.currentWord.zh  && 
       !excludedWords.has(word.zh)  && 
        wordSimilarities.some(sim  => sim(word)) 
      ); 
 
      if (candidates.length  === 0) { 
        return null; 
      } 
 
      const selectedWord = candidates[Math.floor(Math.random() * candidates.length)];  
      excludedWords.add(selectedWord.zh);  
      return selectedWord.zh;  
    }; 
 
    const wrongOptions = []; 
    while (wrongOptions.length  < 3) { 
      const option = generateWrongOption(); 
      if (option &&!wrongOptions.includes(option))  { 
        wrongOptions.push(option);  
      } 
    } 
 
    return wrongOptions; 
  } 
 
  calculateStringSimilarity(str1, str2) { 
    const set1 = new Set(str1.split(''));  
    const set2 = new Set(str2.split(''));  
    const intersection = new Set([...set1].filter(x => set2.has(x)));  
    return intersection.size  / Math.max(set1.size,  set2.size);  
  } 
 
  getRandomLetter(baseLetter) { 
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split(''); 
    const filteredAlphabet = alphabet.filter(l  => l!== baseLetter.toLowerCase());  
    return filteredAlphabet[Math.floor(Math.random() * filteredAlphabet.length)];  
  } 
 
  maskWord(word) { 
    const nonSpaceChars = word.split('').filter(char  => char!== ' '); 
    const maskedLength = Math.floor(nonSpaceChars.length  / 2); 
    
    const maskedPositions = this.getRandomPositions(word.length,  maskedLength); 
    return word.split('').map((char,  index) => 
      char === ' '? char : (maskedPositions.includes(index)?  '_' : char) 
    ).join(''); 
  } 
 
  extractMissingLetters(word, maskedWord) { 
    const missingPositions = maskedWord.split('').reduce((acc,  char, index) => { 
      if (char === '_' && word[index]!== ' ') acc.push(index);  
      return acc; 
    }, []); 
 
    return missingPositions.map(pos  => word[pos]); 
  } 
 
  compareLetters(arr1, arr2) { 
    return arr1.slice().sort().join('')  === arr2.slice().sort().join('');  
  } 
 
  bindOptionListeners(callback) { 
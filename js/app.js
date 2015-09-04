var myModule = angular.module('Forca', []);


myModule.service('ForcaService', function(){
    var service = this;
    
    service.createWordCharArray = function(word){
        var ret = [];
        for(var i=0; i<word.length; i++){
            ret.push({'letter' : word[i], 'discovered' : false});
        }
        return ret;
    };
    
    service.createAlphabetCharArray = function(){
        var ret = [];
        var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for(var i=0; i<alphabet.length; i++){
            ret.push({'letter' : alphabet[i], 'used' : false});
        }
        return ret;
    }

    service.checkIfWon = function(wordLetters){
        for(var i=0; i<wordLetters.length; i++){
            if(wordLetters[i].discovered == false){
                return false;
            }
        }
        return true;
    }

    service.getCurrentImagePath = function(errorCount){
        return 'images/forca_' + errorCount + '.jpg'
    }

    service.getNewWord = function(){
        var words = ['ABOBORA', 'ABACAXI', 'MELANCIA', 'MELAO', 
                'LIMAO', 'PERA', 'MACA', 'LIXIA'];
        var randIndex = Math.floor((Math.random() * words.length));
        return words[randIndex];
    }

});


myModule.controller('MainCtrl', function(ForcaService, $scope){

	var main = this;
	
    main.restart = function(){
        main.errors = 0;
        main.gameOver = false;
        main.word = ForcaService.getNewWord();
        main.forcaImg = ForcaService.getCurrentImagePath(main.errors);
        main.wordLetters = ForcaService.createWordCharArray(main.word);
        main.alphabetLetters = ForcaService.createAlphabetCharArray();
    }
    main.restart();
    
    main.tryAlphabetLetter = function(l, index){

        //if game is already over
        if(main.gameOver){
            alert("Restart the game!");
            return;
        }
        
        //try to find letter in word
        l.used = true;
        var foundLetter = false;
        for(var i=0; i<main.wordLetters.length; i++){
            if(l.letter == main.wordLetters[i].letter){
                main.wordLetters[i].discovered = true;
                foundLetter = true;
            }
        }
        if(foundLetter){            
            //found letter, check if won
            if(ForcaService.checkIfWon(main.wordLetters)){
                main.gameOver = true;
                $scope.$apply();    //update before alert
                alert("You won!");
            }
        }
        //did not find letter increment errors and change image
        else{
            main.errors++;
            main.forcaImg = ForcaService.getCurrentImagePath(main.errors);
        }

        //check if lost
        if(main.errors>=6){
            main.gameOver = true;
            $scope.$apply();    //update image before alert when game over
            alert("You lost!");
        }
    }


});

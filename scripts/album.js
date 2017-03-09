
// Store state of playing songs
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;


var setSong = function(songNumber) {
	  if (currentSoundFile) {
			  currentSoundFile.stop();
		}
	
	  currentlyPlayingSongNumber = parseInt(songNumber);
	  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
	  // #1
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
         // #2
         formats: [ 'mp3' ],
         preload: true
     });
	
	setVolume(currentVolume);
}

var setVolume = function(volume) {
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
 };


var getSongNumberCell = function(number) {
	return $('.song-item-number[data-song-number="' + number + '"]');
};

var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
		 var $row= $(template);

	var clickHandler = function() {
			 
		 var songNumber = parseInt($(this).attr('data-song-number'), 10);
		  currentlyPlayingSongNumber = currentlyPlayingSongNumber ? 
			parseInt(currentlyPlayingSongNumber, 10) : null;
		 if (currentlyPlayingSongNumber !== null) {
				// Revert to song number for currently playing song because user started playing new song.
				var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
				currentlyPlayingCell.html(currentlyPlayingSongNumber);
			}
			if (currentlyPlayingSongNumber !== songNumber) {
					// Switch from Play -> Pause button to indicate new song is playing.
					$(this).html(pauseButtonTemplate);
					setSong(songNumber);
				  currentSoundFile.play();
				  updatePlayerBarSong();
			} else if (currentlyPlayingSongNumber === songNumber) {
					if (currentSoundFile.isPaused()) {
                $(this).html(pauseButtonTemplate);
               $('.main-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
            } else {
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();   
            }

				}
			};
	   
		 var onHover = function(event) {
         var songNumberCell = $(this).find('.song-item-number');
         var songNumber = parseInt(songNumberCell.attr('data-song-number'), 10);
			   if (songNumber !== parseInt(currentlyPlayingSongNumber, 10)) {
					   songNumberCell.html(playButtonTemplate);
				 }
     };
     var offHover = function(event) {
         var songNumberCell = $(this).find('.song-item-number');
         var songNumber = parseInt(songNumberCell.attr('data-song-number'), 10);
			   if (songNumber !== parseInt(currentlyPlayingSongNumber,10)) {
					  songNumberCell.html(songNumber)
				 }
     };

     $row.find('.song-item-number').click(clickHandler);
     $row.hover(onHover, offHover);
     return $row;

 };

var setCurrentAlbum = function(album) {
		 currentAlbum = album;
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
 
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
 
     // #3
     $albumSongList.empty();
 
     // #4
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
 };

 var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
 };

 var updatePlayerBarSong = function() {

    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
	  $('.main-controls .play-pause').html(playerBarPauseButton);


};

  

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';



var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPauseControl = $('.main-controls .play-pause');

var togglePlayFromPlayerBar = function() {
			var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber)
			if (currentSoundFile.isPaused()) {
						$(currentlyPlayingCell).html(pauseButtonTemplate);
					  $('.main-controls .play-pause').html(playerBarPauseButton);
						currentSoundFile.play();
				} else {
						$(currentlyPlayingCell).html(playButtonTemplate);
						$('.main-controls .play-pause').html(playerBarPlayButton);
						currentSoundFile.pause();   
		  }
}

var nextSong = function() {
	var getLastSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    };

    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _incrementing_ the song here
    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }

    // Set a new current song
    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
		setSong(currentlyPlayingSongNumber);

    // Update the Player Bar information
    updatePlayerBarSong();
		currentSoundFile.play();

    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);

};

	



var previousSong = function() {
	// Note the difference between this implementation and the one in
    // nextSong()
    var getLastSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };

    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _decrementing_ the index here
    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }

    // Set a new current song
    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
		setSong(currentlyPlayingSongNumber);
    // Update the Player Bar information
    updatePlayerBarSong();
		currentSoundFile.play();

    $('.main-controls .play-pause').html(playerBarPauseButton);

    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);

};


$(document).ready(function() {
	setCurrentAlbum(albumPicasso);
	
	$previousButton.click(previousSong);
	$nextButton.click(nextSong);  
	$playPauseControl.click(togglePlayFromPlayerBar);
  //     albums after 1st don't release play
   var albums = [albumPicasso, albumMarconi];
   var currentAlbumIndex = 1;
     
    document.getElementsByClassName('album-cover-art')[0].addEventListener('click', function(event) {
        setCurrentAlbum(albums[currentAlbumIndex]);
        currentAlbumIndex++;
         if (currentAlbumIndex > 2) {
             currentAlbumIndex = 0;
         };
			});
			
  });
     

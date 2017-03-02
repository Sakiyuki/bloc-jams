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
			 
		 var songNumber = $(this).attr('data-song-number');

		 if (currentlyPlayingSongNumber !== null) {
				// Revert to song number for currently playing song because user started playing new song.
				var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
				currentlyPlayingCell.html(currentlyPlayingSongNumber);
			}
			if (currentlyPlayingSongNumber !== songNumber) {
					// Switch from Play -> Pause button to indicate new song is playing.
					$(this).html(pauseButtonTemplate);
					currentlyPlayingSongNumber = songNumber;
				  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
				  updatePlayerBarSong();
			} else if (currentlyPlayingSongNumber === songNumber) {
					// Switch from Pause -> Play button to pause currently playing song.
					$(this).html(playButtonTemplate);
				  $('.main-controls .play-pause').html(playerBarPlayButton);
					currentlyPlayingSongNumber = null;
				  currentSongFromAlbum = null;
				}
			};
	   
		 var onHover = function(event) {
         var songNumberCell = $(this).find('.song-item-number');
         var songNumber = songNumberCell.attr('data-song-number');

			   if (songNumber !== currentlyPlayingSongNumber) {
					   songNumberCell.html(playButtonTemplate);
				 }
     };
     var offHover = function(event) {
         var songNumberCell = $(this).find('.song-item-number');
         var songNumber = songNumberCell.attr('data-song-number');

			   if (songNumber !== currentlyPlayingSongNumber) {
					  songNumberCell.html(songNumber)
				 }
     };
	
		 var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };

    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
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


// Store state of playing songs
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

var nextSong = function() {
	$(".song-item-number")[currentlyPlayingSongNumber - 1].innerHTML = currentlyPlayingSongNumber
	currentlyPlayingSongNumber++
	if (currentlyPlayingSongNumber >= currentAlbum.songs.length){
		currentlyPlayingSongNumber = 1
	}
	$(".song-item-number")[currentlyPlayingSongNumber - 1].innerHTML = pauseButtonTemplate
	currentSongFromAlbum = currentAlbum.songs[currentlyPlayingSongNumber - 1]
	updatePlayerBarSong();
	
}

var previousSong = function() {
	
}

$(document).ready(function() {
	setCurrentAlbum(albumPicasso);
	
	$previousButton.click(previousSong);
	$nextButton.click(nextSong);  
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
     

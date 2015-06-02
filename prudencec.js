// ==UserScript==
// @name          Simple blocking script for ff.net and ao3
// @namespace     http://www.michellekhuu.com/flightblockscript
// @author     	  Michelle Khuu
// @description   Happy birthday Zerrat! Blocks specific authors from ff.net, 
//					as well as specified summary keywords. Also, thanks fmo for
//					catching bugs~ 
// @grant       GM_getValue
// @grant       GM_setValue
// @include		  http://*.fanfiction.net/*
// @include		  http://archiveofourown.org/*
// @version 0.9
// ==/UserScript==

// =================== <3 <3 <3 SETTINGS FOR NON-CODERS <3 <3 <3 ===================//

//Display options for how fic summaries will appear. Only applies to fics that match 'wordsBlackList'
//				0 = custom
//				1 = replace entire summaries with the frf gif
//              2 = add warning to beginning of summary
//				3 = 50-50 chance of summary being replaced by frf gif, or one of the strings from 'awesomeComments'
//				4 = replace entire summary with random string from 'awesomeComments'
//				5 = add warning to beginning of summary, followed with random string from 'awesomeComments'

var mode = 5;					//Change this value according to ^^^

//				0 = Disable
//				1 = Enable

// -- Modify this section if custom mode chosen --//
var displayWarning = 1;			//Display matched words from 'wordsBlackList'
var displaySummary = 1;			//Display original summary
var displayExtra = 1;			//Display extra commentary
var displayTags = 1;			//Display story info (rating, reviews, chapters). FFNet Only!
// -- End custom mode section --//

var hideStorySummaryMatch = 0;	//Hide fic if summary contains keyword in 'wordsBlackList'
var hideStoryAuthorMatch = 1; 	//Hide fic if author is part of 'authorBlackList'

var enableFFNet = 1;			//Apply this script on fanfiction.net
var enableAO3 = 1;				//Apply this script on archiveofourown.org

var fontColor = "red";			//font color used in summary replacements
var commentColor = "green";		//font color used for strings in 'awesomeComments'

var picSource = "http://www.michellekhuu.com/other/frf.gif";	//Defaulted to FRF Gif. Feel free to replace with image of your own choosing

var ffnetAuthorBlackList = ['prudence chastity', 'krush14'];				//LOWERCASE ONLY. List of authors to block on ffnet
var ao3AuthorBlackList = ['prudence_chastity'];								//LOWERCASE ONLY. List of authors to block on ao3
var wordsBlackList = ['futa', 'rape', 'noncon', 'dubcon', 'herm', 'hopexlightning', 
						'hopexlight', 'lightxhope', 'lightningxhope'];		//LOWERCASE ONLY. List of keywords/pairings to block

//List of AWESOMEO COMMENTS
var awesomeComments = ['FLIGHT CHAT IS AWESOME', 'Dont read this fic', 
					'Michelle is the coolest person ever', 'Ask pup to read this',
					'I ship Ziv', 'This took a really longass fucking time btw',
					'I hope you appreciate this', 'No, seriously, I hope you appreciate this',
					'You had a birthday when I made this, so happy birthday!', 
					'Unfortunately, this will only work on your laptop', 'Pup was here', 
					'ANGST IS BAD Z', 'Please write forever', 'So how about W\'s fic? Cause this sure ain\'t it',
					'Please read quality fic instead of this', 'DO NOT WANT', 'fmo says hi.. or DOES SHE?',
					'fmo listens to some really weird shit at work', 'I LOVE PUSSY... cats', 'YOU ARE AWESOME',
					'YOU ARE AN AMAZING WRITER', 'FLIGHT FOREVER', 'BELIEVE IN THE US THAT BELIEVES IN YOU',
					'Next time your gf is stuck on zoids, remove your shirt', 
					'If removing your shirt doesn\'t work, remove your pants', 'Is that a Prudence fic? Naw, it\'s just us',
					'So who would you bang, Lightning or Fang?', 'A thing. A thing? Yes, this is a thing. A bad thing.',
					'Damn, I wish we could block PC. Oh wait, we did!', 'SIGHS AT YOU', 'Whatever.', 'You\'re a loser',
					'Go bang already.'];
					
// ========= <3 <3 <3 END SETTINGS FOR NON-CODERS DON'T TOUCH UNLESS YOU'RE FMO <3 <3 <3 =========//

var ffnet = 1;
var ao3 = 2;
var siteID;

var storylist = ""; 
var summarylist = ""; 
var authorBlackList = "";

if(location.hostname.match('archiveofourown.org') && enableAO3==1)
{
	siteID = ao3;
	authorBlackList = ao3AuthorBlackList;
	storylist = document.getElementsByClassName('work blurb group');
	summarylist = document.getElementsByClassName('userstuff summary');
}
else if (location.hostname.match('fanfiction.net') && enableFFNet==1)
{
	siteID = ffnet;
	authorBlackList = ffnetAuthorBlackList;
	storylist = document.getElementsByClassName('z-list');
	summarylist = document.getElementsByClassName('z-indent z-padtop');
}

if(hideStoryAuthorMatch == 1)
{
	for(var a = 0; a < storylist.length; a++)
	{
		var storyData = storylist[a].innerHTML.toLowerCase();
		for(var b = 0; b < authorBlackList.length; b++)
		{
			if(storyData.match(authorBlackList[b]))
			{
				storylist[a].style.display = 'none';
			}
		}
	}
}
	
//Searches summary info for select keywords
for(var i = 0; i < summarylist.length; i++)
{
	var summaryData = summarylist[i].innerHTML.toLowerCase();
	
	for(var j = 0; j < wordsBlackList.length; j++)
	{
		if(summaryData.match(wordsBlackList[j]))
		{
			if(hideStorySummaryMatch == 1)
			{
				storylist[i].style.display = 'none';
			}else{
				summarylist[i].innerHTML = replaceSummary(summarylist[i].innerHTML, wordsBlackList[j]);
			}
			break;
		}
	}
}

//Replace summaries that contain blacklist words with happier stuff	
function replaceSummary(origHTML, matchedWord)
{
	var chosenString = "";
	var rand = Math.floor((Math.random()*awesomeComments.length));
	var rand2 = Math.random();
	
	var summarywEnd = origHTML.split("<div class=\"z-padtop2 xgray\">");
	var summary = summarywEnd[0];
	var endTags = "";
	
	switch(siteID)
	{
		case ffnet:
			endTags = "<div class=\"z-padtop2 xgray\">" + summarywEnd[1];
			break;
		case ao3:	
			break;
	}

	switch(mode)
	{
		case 0:
			if(displayWarning == 1)
				chosenString += "<font color=" + fontColor + ">" + matchedWord.toUpperCase() + "</font> ";
			if(displaySummary == 1)
				chosenString += "<font color=\"grey\">" + summary + "</font> ";
			if(displayExtra == 1)
				chosenString += "<br><font color=" + commentColor + ">"
				+ awesomeComments[rand] + "</font>";
			if(displayTags == 1)
				chosenString += endTags;
			break;
		case 1:
			chosenString = "<img src=" + picSource + ">";
			break;
		case 2:
			chosenString = "<font color=" + fontColor + ">" + matchedWord.toUpperCase() 
			+ "</font> " + "<font color=\"grey\">" + summary + "</font>";
			break;
		case 3:
			if(rand2 > .5)
				chosenString = "<font color=" + fontColor + ">" + matchedWord.toUpperCase() 
				+ "</font> " + "<font color=" + commentColor + ">" + awesomeComments[rand] + "</font> ";
			else
				chosenString = "<img src=" + picSource + ">";
			break;
		case 4:
			chosenString = "<font color=" + commentColor + ">" + awesomeComments[rand] + "</font> ";
			break;
		case 5:
			chosenString = "<font color=" + fontColor + ">" + matchedWord.toUpperCase() 
			+ "</font> " + "<font color=" + commentColor + ">" + awesomeComments[rand] + "</font> ";
			break;
	}
	
	return chosenString;
}

# BasicDiceOnDiscord
A basic dice roller bot made for discord. Probably hosted on heroku.

Support for a decent bit of basic rolling features, mostly inspired by roll20 format.

**Basic Format** : 
!roll NdS + K
where : 
 - N : number of dice
 - d : separator. Could be substituted for with a D too. 
 - S : Size of dice. So 4, 6, 8 ... It's derived from a PRNG, so use any positive number you wish.
 - + : Is a plus. Could be a minus too. 
 - K : Constant to be added to the total dice roll. Could also be a sequence of more dice if required.
 
## More features
Comments : Anything proceeded by a '#' is labeled as a comment and will make the result be labeled as such.
Rolling and discarding : Dice rolls proceeded by kh (keep higher rolls) or kl (keep lower rolls) will keep
  the required rolls, be they lower or higher. This needs to be followed by a number as number of dice to kept
  is needed.

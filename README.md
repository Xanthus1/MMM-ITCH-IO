# MMM-ITCH-IO
Module for Magic Mirror to display game images/descriptions from ITCH.IO .  By default it will display currently featured
games, along with recent highly rated free game. However, different lists can easily be added.

<img src="https://raw.githubusercontent.com/Xanthus1/MMM-ITCH-IO/master/screenshots/example.png" width="33%"></img>

## Installation
To install, run the following command in your MagicMirror/modules directory:
```shell
  git clone https://github.com/Xanthus1/MMM-ITCH-IO/
```

## Setup / Configuration

### Include in MagicMirror configuration
To use this module, include it in the 'MagicMirror/config/config.js' file:
```js
  modules: [
    {
        module: 'MMM-ITCH-IO',
        position: 'bottom_third',  
        config: {
            // See below for configurable options
        }
    }
  ]
```

### Configuration
<table>
    <tr>
        <th> Field </th>
        <th> Type </th>
        <th> Default / Description </th>
    </tr>
    <tr>
        <td>loadingText</td>
        <td>String </td>
        <td><i>"Loading games..."</i><br> Text that displays while the games are loading at the start</td>
    <tr>
    <tr>
        <td>updateInterval</td>
        <td>Integer (in ms)</td>
        <td><i>10*1000</i><br>New games will be shown at this interval</td>
    <tr>
    <tr>
        <td>animationSpeed</td>
        <td>Integer (in ms)</td>
        <td><i>3*1000</i><br>Length of the fade in / out animation between games</td>
    <tr>
    <tr>
        <td>maxWidth</td>
        <td>String</td>
        <td><i>"100%"</i><br>style attribute for the game image's maxWidth</td>
    <tr>
    <tr>
        <td>maxHeight</td>
        <td>String</td>
        <td><i>"250px"</i><br>style attribute for the game image's maxHeight</td>
    <tr>
    <tr>
        <td>borderRadius</td>
        <td>String</td>
        <td><i>"25px"</i><br>style attribute for the game image's border radius (rounded edges). Set to 0 to remove</td>
    <tr>
    <tr>
        <td>gamelists</td>
        <td> Array of Objects</td>
        <td>          
          <i>See "MMM-ITCH-IO.js" for default setting.</i><br>
          List of urls and accomanying list titles (displayed under each game). More valid URLs can be added by doing a search or filter on https://itch.io, then adding ".xml" to the URL.
        </td>
    </tr>
    <tr>
        <td>limit</td>
        <td> Integer</td>
        <td> <i>7</i><br> Limit on the number of games to show from each list </td>
    </tr>
    <tr>
        <td>descriptionLimit</td>
        <td> Integer</td>
        <td> <i>150</i><br> Limit the description to this number of characters. </td>
    </tr>
        
</table>

## Thank you!
Thank you for checking this out! Please let me know if you have any issues, want to contribute, or have ideas for improvement.

### Wishlist:
 - Potentially improve CSS/styling after testing on different layouts
 - Interactive: Implement a way to click on a game and save it (maybe by e-mail notification or html file that can be browsed / managed)
 - Interactive: Click to advance to next game
 - Expand this module to include more Indie game sources.

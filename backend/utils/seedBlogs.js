const mongoose = require('mongoose');
const Blog = require('../models/Blog');
require('dotenv').config();

// Helper function to generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Sample blog data for MySeries11
const sampleBlogs = [
  {
    title: "Top 5 Fantasy Cricket Tips for IPL 2024",
    excerpt: "Master the art of fantasy cricket with these proven strategies that will help you dominate your leagues and win big prizes this IPL season.",
    content: `
      <h2>Introduction to Fantasy Cricket Success</h2>
      <p>Fantasy cricket has become one of the most exciting ways to engage with the sport we love. With IPL 2024 in full swing, it's time to sharpen your fantasy skills and maximize your winnings.</p>
      
      <h3>1. Research Team Form and Player Conditions</h3>
      <p>Before selecting your team, always check:</p>
      <ul>
        <li>Recent player performances and consistency</li>
        <li>Injury reports and player availability</li>
        <li>Head-to-head records against specific teams</li>
        <li>Home vs away performance statistics</li>
      </ul>
      
      <h3>2. Understand Pitch and Weather Conditions</h3>
      <p>Different pitches favor different types of players. Batting-friendly pitches in Mumbai and Bangalore often see high scores, while Chennai's spin-friendly tracks favor spin bowlers.</p>
      
      <h3>3. Captain and Vice-Captain Selection</h3>
      <p>Your captain gets 2x points and vice-captain gets 1.5x points. Choose players who are:</p>
      <ul>
        <li>In excellent recent form</li>
        <li>Playing key roles (top-order batsmen, lead bowlers)</li>
        <li>Consistent performers rather than risky picks</li>
      </ul>
      
      <h3>4. Balance Your Team Composition</h3>
      <p>A winning fantasy team typically includes:</p>
      <ul>
        <li>3-4 reliable batsmen including 1-2 top-order players</li>
        <li>2-3 bowlers with wicket-taking ability</li>
        <li>1-2 all-rounders for maximum points potential</li>
        <li>1 wicket-keeper (preferably one who bats in top 6)</li>
      </ul>
      
      <h3>5. Monitor Team News and Last-Minute Changes</h3>
      <p>Always check team announcements 1-2 hours before the deadline. Late changes in playing XI can significantly impact your team's performance.</p>
      
      <h2>Conclusion</h2>
      <p>Success in fantasy cricket comes from thorough research, strategic thinking, and staying updated with the latest cricket news. Follow these tips consistently, and you'll see improvement in your fantasy rankings!</p>
      
      <p><strong>Ready to put these tips into action? Join MySeries11 and start building your winning fantasy teams today!</strong></p>
    `,
    author: "Cricket Expert",
    category: "fantasy",
    tags: ["fantasy cricket", "IPL", "tips", "strategy", "captain selection"],
    featuredImage: "/images/blog/fantasy-cricket-tips.jpg",
    status: "published",
    metaTitle: "Top 5 Fantasy Cricket Tips for IPL 2024",
    metaDescription: "Master fantasy cricket with proven IPL 2024 strategies. Learn captain selection, team composition, and winning tips for MySeries11.",
    views: 1250,
    likes: 87,
    publishedAt: new Date('2024-03-15'),
    autoSaved: false,
    lastSaved: new Date(),
    isDraft: false,
  },
  {
    title: "Mumbai Indians vs Chennai Super Kings: Match Preview & Predictions",
    excerpt: "Get ready for the ultimate IPL rivalry! Our comprehensive match preview covers team analysis, key players, and expert predictions for MI vs CSK.",
    content: `
      <h2>The Ultimate IPL Rivalry Returns</h2>
      <p>When Mumbai Indians face Chennai Super Kings, it's not just a cricket match – it's a battle between two IPL powerhouses with a combined 9 championship titles.</p>
      
      <h3>Team Form Analysis</h3>
      <h4>Mumbai Indians</h4>
      <p>MI comes into this match with a mixed bag of performances. Their batting lineup shows promise with Rohit Sharma and Ishan Kishan at the top, but they need consistency from their middle order.</p>
      
      <ul>
        <li><strong>Strengths:</strong> Strong opening partnership, experienced bowling attack</li>
        <li><strong>Weaknesses:</strong> Middle-order inconsistency, over-reliance on key players</li>
        <li><strong>Recent Form:</strong> W-L-W-L-W (Last 5 matches)</li>
      </ul>
      
      <h4>Chennai Super Kings</h4>
      <p>CSK's experience and strategic depth make them formidable opponents. MS Dhoni's leadership continues to be their biggest asset, especially in crunch situations.</p>
      
      <ul>
        <li><strong>Strengths:</strong> Tactical brilliance, death-over specialists, spin bowling</li>
        <li><strong>Weaknesses:</strong> Aging squad, pace bowling concerns</li>
        <li><strong>Recent Form:</strong> W-W-L-W-W (Last 5 matches)</li>
      </ul>
      
      <h3>Key Players to Watch</h3>
      <h4>Mumbai Indians</h4>
      <ul>
        <li><strong>Rohit Sharma (C):</strong> The captain's form will be crucial for MI's success</li>
        <li><strong>Jasprit Bumrah:</strong> MI's pace spearhead and death-over specialist</li>
        <li><strong>Hardik Pandya:</strong> The all-rounder's contributions with bat and ball</li>
      </ul>
      
      <h4>Chennai Super Kings</h4>
      <ul>
        <li><strong>MS Dhoni (C):</strong> The finisher's tactical acumen and big-hitting ability</li>
        <li><strong>Ravindra Jadeja:</strong> All-round contributions and fielding excellence</li>
        <li><strong>Deepak Chahar:</strong> Powerplay specialist and swing bowler</li>
      </ul>
      
      <h3>Pitch Report: Wankhede Stadium</h3>
      <p>The Wankhede Stadium typically offers a batting-friendly surface with good carry and bounce. Expect scores around 180-200 in this high-scoring venue.</p>
      
      <h3>Fantasy Cricket Tips</h3>
      <ul>
        <li>Pick at least 6-7 players from both teams combined</li>
        <li>Consider MS Dhoni as captain for his big-match experience</li>
        <li>Include both teams' powerplay specialists</li>
        <li>Don't miss out on proven all-rounders like Hardik and Jadeja</li>
      </ul>
      
      <h3>Our Prediction</h3>
      <p><strong>Winner:</strong> Chennai Super Kings by 15 runs</p>
      <p><strong>Reasoning:</strong> CSK's experience in high-pressure matches and better team balance gives them the edge over MI's inconsistent form.</p>
      
      <p><em>Create your fantasy team on MySeries11 and put your cricket knowledge to the test!</em></p>
    `,
    author: "Match Analyst",
    category: "cricket",
    tags: ["MI vs CSK", "match preview", "IPL", "predictions", "cricket analysis"],
    featuredImage: "/images/blog/mi-vs-csk-preview.jpg",
    status: "published",
    metaTitle: "MI vs CSK Match Preview: Predictions & Fantasy Tips",
    metaDescription: "Complete MI vs CSK match preview with team analysis, key players, pitch report, and fantasy cricket tips for IPL 2024.",
    views: 890,
    likes: 65,
    publishedAt: new Date('2024-03-18'),
    autoSaved: false,
    lastSaved: new Date(),
    isDraft: false,
  },
  {
    title: "How to Build a Winning Fantasy Cricket Team on a Budget",
    excerpt: "Discover the secrets of creating championship-winning fantasy teams without breaking the bank. Learn about hidden gems and value picks.",
    content: `
      <h2>Smart Fantasy Cricket: Maximum Points, Minimum Budget</h2>
      <p>You don't need the most expensive players to win fantasy cricket. Some of the biggest tournament winners have built their teams around smart budget picks and overlooked performers.</p>
      
      <h3>Understanding Player Pricing</h3>
      <p>Fantasy cricket platforms price players based on recent performances, popularity, and demand. This creates opportunities to find undervalued players who can deliver big points.</p>
      
      <h3>Budget Allocation Strategy</h3>
      <h4>The 60-40 Rule</h4>
      <ul>
        <li><strong>60% of budget:</strong> Spend on 4-5 reliable core players</li>
        <li><strong>40% of budget:</strong> Find value picks and differential players</li>
      </ul>
      
      <h3>Finding Hidden Gems</h3>
      <h4>Uncapped Players</h4>
      <p>Young, uncapped players often provide incredible value. Look for players who:</p>
      <ul>
        <li>Are getting regular opportunities</li>
        <li>Have shown promise in domestic cricket</li>
        <li>Are priced lower due to lack of international experience</li>
      </ul>
      
      <h4>Middle-Order Specialists</h4>
      <p>While everyone picks top-order batsmen, smart managers identify middle-order players who:</p>
      <ul>
        <li>Bat in crucial situations</li>
        <li>Have good strike rates</li>
        <li>Are priced lower than openers</li>
      </ul>
      
      <h3>Budget-Friendly Player Categories</h3>
      
      <h4>Wicket-Keepers (7-9 credits)</h4>
      <ul>
        <li>Look for keepers who bat in top 6</li>
        <li>Consider backup keepers who might get opportunities</li>
        <li>Prioritize consistent performers over big names</li>
      </ul>
      
      <h4>All-Rounders (8-10 credits)</h4>
      <ul>
        <li>Bowling all-rounders often provide better value</li>
        <li>Look for players with regular bowling quotas</li>
        <li>Consider those who bat in powerplay or death overs</li>
      </ul>
      
      <h4>Bowlers (7-8 credits)</h4>
      <ul>
        <li>Powerplay specialists in helpful conditions</li>
        <li>Spinners on turning tracks</li>
        <li>Death bowlers with good economy rates</li>
      </ul>
      
      <h3>Sample Budget Team Composition</h3>
      <table border="1" style="border-collapse: collapse; width: 100%;">
        <tr>
          <th>Role</th>
          <th>Players</th>
          <th>Budget Allocation</th>
        </tr>
        <tr>
          <td>Premium Batsman</td>
          <td>1</td>
          <td>10-11 credits</td>
        </tr>
        <tr>
          <td>Mid-range Batsmen</td>
          <td>2-3</td>
          <td>7-9 credits each</td>
        </tr>
        <tr>
          <td>All-rounders</td>
          <td>2</td>
          <td>8-10 credits each</td>
        </tr>
        <tr>
          <td>Bowlers</td>
          <td>3-4</td>
          <td>6-8 credits each</td>
        </tr>
        <tr>
          <td>Wicket-keeper</td>
          <td>1</td>
          <td>7-9 credits</td>
        </tr>
      </table>
      
      <h3>Advanced Budget Strategies</h3>
      
      <h4>The Differential Pick</h4>
      <p>Include 1-2 low-ownership players who could have big games. This strategy helps you climb rankings quickly if your picks perform.</p>
      
      <h4>Match-up Based Selection</h4>
      <p>Choose budget bowlers who have good records against specific teams or in particular venues.</p>
      
      <h3>Common Budget Mistakes to Avoid</h3>
      <ul>
        <li>Spending too much on just 2-3 players</li>
        <li>Ignoring player roles and batting positions</li>
        <li>Picking budget players without research</li>
        <li>Not considering match conditions and venue</li>
      </ul>
      
      <h3>Tools for Budget Team Building</h3>
      <ul>
        <li>Use player comparison features</li>
        <li>Check recent form and consistency</li>
        <li>Analyze price changes and trends</li>
        <li>Read expert analysis and recommendations</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Building a winning fantasy team on a budget requires research, patience, and smart decision-making. Focus on finding undervalued players who can deliver consistent points rather than chasing expensive stars.</p>
      
      <p><strong>Ready to build your budget champion team? Start your journey on MySeries11 today!</strong></p>
    `,
    author: "Fantasy Guru",
    category: "fantasy",
    tags: ["budget team", "fantasy cricket", "value picks", "strategy", "tips"],
    featuredImage: "/images/blog/budget-fantasy-team.jpg",
    status: "published",
    metaTitle: "Build Winning Fantasy Cricket Teams on Budget",
    metaDescription: "Learn how to create championship fantasy cricket teams without spending big. Discover budget strategies, value picks, and hidden gems.",
    views: 756,
    likes: 45,
    publishedAt: new Date('2024-03-20'),
    autoSaved: false,
    lastSaved: new Date(),
    isDraft: false,
  },
  {
    title: "Understanding Cricket Pitch Types and Their Impact on Fantasy Selection",
    excerpt: "Learn how different pitch conditions affect player performance and make smarter fantasy cricket selections based on ground characteristics.",
    content: `
      <h2>Why Pitch Knowledge Wins Fantasy Leagues</h2>
      <p>Understanding pitch conditions is one of the most overlooked aspects of fantasy cricket. The surface on which the match is played can dramatically influence player performance and point-scoring opportunities.</p>
      
      <h3>Types of Cricket Pitches</h3>
      
      <h4>1. Batting-Friendly Pitches</h4>
      <p><strong>Characteristics:</strong></p>
      <ul>
        <li>True bounce and good carry</li>
        <li>Minimal seam or spin movement</li>
        <li>Fast outfield</li>
        <li>High-scoring games (180+ typically)</li>
      </ul>
      
      <p><strong>Examples:</strong> Wankhede Stadium (Mumbai), M. Chinnaswamy Stadium (Bangalore)</p>
      
      <p><strong>Fantasy Strategy:</strong></p>
      <ul>
        <li>Load up on top-order batsmen</li>
        <li>Pick aggressive stroke-makers</li>
        <li>Consider wicket-keepers who bat high</li>
        <li>Avoid defensive bowlers</li>
      </ul>
      
      <h4>2. Bowler-Friendly Pitches</h4>
      <p><strong>Characteristics:</strong></p>
      <ul>
        <li>Uneven bounce or excessive seam movement</li>
        <li>Slower outfield</li>
        <li>Early wickets common</li>
        <li>Lower total games (140-160 range)</li>
      </ul>
      
      <p><strong>Examples:</strong> Some matches at Eden Gardens (Kolkata), Delhi venues</p>
      
      <p><strong>Fantasy Strategy:</strong></p>
      <ul>
        <li>Invest heavily in quality bowlers</li>
        <li>Pick economical bowlers over expensive batsmen</li>
        <li>Choose all-rounders who bowl</li>
        <li>Avoid lower-order batsmen</li>
      </ul>
      
      <h4>3. Spin-Friendly Pitches</h4>
      <p><strong>Characteristics:</strong></p>
      <ul>
        <li>Dry, dusty surface</li>
        <li>Turn and grip for spinners</li>
        <li>Slows down as match progresses</li>
        <li>Middle-over wickets common</li>
      </ul>
      
      <p><strong>Examples:</strong> M. A. Chidambaram Stadium (Chennai), some Pune tracks</p>
      
      <p><strong>Fantasy Strategy:</strong></p>
      <ul>
        <li>Pick quality spinners from both teams</li>
        <li>Choose batsmen good against spin</li>
        <li>Consider spin-bowling all-rounders</li>
        <li>Be cautious with pace-only bowlers</li>
      </ul>
      
      <h3>Venue-Specific Analysis</h3>
      
      <h4>Wankhede Stadium, Mumbai</h4>
      <ul>
        <li><strong>Nature:</strong> Batting paradise</li>
        <li><strong>Average Score:</strong> 185-200</li>
        <li><strong>Key Factor:</strong> Short boundaries favor big hitters</li>
        <li><strong>Fantasy Focus:</strong> Power hitters, death bowlers</li>
      </ul>
      
      <h4>M. A. Chidambaram Stadium, Chennai</h4>
      <ul>
        <li><strong>Nature:</strong> Spin-friendly, slows down</li>
        <li><strong>Average Score:</strong> 160-175</li>
        <li><strong>Key Factor:</strong> Spinners dominate middle overs</li>
        <li><strong>Fantasy Focus:</strong> Spinners, spin-friendly batsmen</li>
      </ul>
      
      <h4>Eden Gardens, Kolkata</h4>
      <ul>
        <li><strong>Nature:</strong> Balanced, slight assistance to bowlers</li>
        <li><strong>Average Score:</strong> 170-185</li>
        <li><strong>Key Factor:</strong> Dew factor in evening games</li>
        <li><strong>Fantasy Focus:</strong> Balanced approach, consider toss</li>
      </ul>
      
      <h3>Weather Impact on Pitches</h3>
      
      <h4>Dew Factor</h4>
      <p>Evening games often see dew formation, which:</p>
      <ul>
        <li>Makes ball slippery for bowlers</li>
        <li>Reduces spin effectiveness</li>
        <li>Favors teams batting second</li>
        <li>Benefits aggressive batsmen</li>
      </ul>
      
      <h4>Overcast Conditions</h4>
      <p>Cloudy weather typically:</p>
      <ul>
        <li>Assists swing bowlers</li>
        <li>Makes batting challenging early on</li>
        <li>Reduces dew formation</li>
        <li>Favors teams bowling first</li>
      </ul>
      
      <h3>Toss Impact and Fantasy Decisions</h3>
      
      <h4>When Teams Bat First</h4>
      <ul>
        <li>More likely on batting-friendly tracks</li>
        <li>Benefits top-order batsmen</li>
        <li>Powerplay bowlers become crucial</li>
        <li>Set clear targets for chasing teams</li>
      </ul>
      
      <h4>When Teams Bowl First</h4>
      <ul>
        <li>Preferred on bowler-friendly surfaces</li>
        <li>Early wicket-takers gain value</li>
        <li>Middle-order batsmen face pressure</li>
        <li>Death bowlers become match-winners</li>
      </ul>
      
      <h3>Advanced Pitch Reading Tips</h3>
      
      <h4>Pre-Match Analysis</h4>
      <ul>
        <li>Check recent matches at the venue</li>
        <li>Analyze average scores and chase success rates</li>
        <li>Look at powerplay and death over statistics</li>
        <li>Consider team preferences and strategies</li>
      </ul>
      
      <h4>Live Pitch Assessment</h4>
      <ul>
        <li>Watch the first few overs closely</li>
        <li>Observe ball behavior and bounce</li>
        <li>Note any unusual movement or turn</li>
        <li>Adjust captain choices if needed</li>
      </ul>
      
      <h3>Common Pitch-Related Fantasy Mistakes</h3>
      <ul>
        <li>Ignoring venue history and statistics</li>
        <li>Not adjusting team composition for conditions</li>
        <li>Overlooking weather forecasts</li>
        <li>Failing to consider toss implications</li>
        <li>Sticking to player preferences regardless of pitch</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Mastering pitch analysis gives you a significant edge in fantasy cricket. By understanding how different surfaces affect player performance, you can make more informed selections and improve your win rate significantly.</p>
      
      <p><strong>Ready to use pitch knowledge to your advantage? Join MySeries11 and start making smarter fantasy decisions!</strong></p>
    `,
    author: "Cricket Analyst",
    category: "tips",
    tags: ["pitch analysis", "cricket conditions", "fantasy strategy", "venue guide", "cricket tips"],
    featuredImage: "/images/blog/cricket-pitch-analysis.jpg",
    status: "published",
    metaTitle: "Cricket Pitch Analysis for Fantasy Selection",
    metaDescription: "Master pitch reading for fantasy cricket success. Learn how different surfaces affect players and make smarter fantasy selections.",
    views: 634,
    likes: 38,
    publishedAt: new Date('2024-03-22'),
    autoSaved: false,
    lastSaved: new Date(),
    isDraft: false,
  },
  {
    title: "Top 10 Fantasy Cricket Mistakes to Avoid",
    excerpt: "Learn from common fantasy cricket errors that cost players thousands of points. Avoid these pitfalls and improve your fantasy game instantly.",
    content: `
      <h2>Don't Let These Mistakes Cost You Championships</h2>
      <p>Even experienced fantasy cricket players make costly errors. By understanding and avoiding these common mistakes, you can immediately improve your performance and win more contests.</p>
      
      <h3>1. Ignoring Team News and Playing XI</h3>
      <p><strong>The Mistake:</strong> Finalizing your team without checking last-minute team announcements.</p>
      
      <p><strong>Why It Hurts:</strong></p>
      <ul>
        <li>Players who don't play score zero points</li>
        <li>Late changes can affect team balance</li>
        <li>Miss opportunities when key players are rested</li>
      </ul>
      
      <p><strong>The Solution:</strong></p>
      <ul>
        <li>Check team news 2-3 hours before deadline</li>
        <li>Follow official team social media accounts</li>
        <li>Use reliable cricket news sources</li>
        <li>Keep backup options ready</li>
      </ul>
      
      <h3>2. Captaining Based on Popularity, Not Logic</h3>
      <p><strong>The Mistake:</strong> Choosing captain based on who others are picking rather than match analysis.</p>
      
      <p><strong>Why It Hurts:</strong></p>
      <ul>
        <li>High ownership means less rank gain when captain performs</li>
        <li>Popular doesn't always mean best for specific match</li>
        <li>Missing differential opportunities</li>
      </ul>
      
      <p><strong>The Solution:</strong></p>
      <ul>
        <li>Analyze recent form and match-ups</li>
        <li>Consider pitch conditions and team strategy</li>
        <li>Look for low-ownership, high-potential players</li>
        <li>Trust your research over crowd wisdom</li>
      </ul>
      
      <h3>3. Overloading on One Team</h3>
      <p><strong>The Mistake:</strong> Picking 7-8 players from the team you think will win.</p>
      
      <p><strong>Why It Hurts:</strong></p>
      <ul>
        <li>If that team fails, your entire lineup suffers</li>
        <li>Miss points from opposing team's contributors</li>
        <li>Lack of balance limits point-scoring opportunities</li>
      </ul>
      
      <p><strong>The Solution:</strong></p>
      <ul>
        <li>Maintain 6-5 or 7-4 split maximum</li>
        <li>Pick best players regardless of team</li>
        <li>Consider that both teams contribute in every match</li>
        <li>Balance based on player roles, not just team preference</li>
      </ul>
      
      <h3>4. Chasing Previous Match Performers</h3>
      <p><strong>The Mistake:</strong> Picking players solely because they scored big in the last game.</p>
      
      <p><strong>Why It Hurts:</strong></p>
      <ul>
        <li>Cricket form is cyclical and inconsistent</li>
        <li>Opposition and conditions change every match</li>
        <li>Prices increase after good performances</li>
      </ul>
      
      <p><strong>The Solution:</strong></p>
      <ul>
        <li>Look at 5-10 match form, not just last game</li>
        <li>Consider opposition strength and conditions</li>
        <li>Focus on consistency over one-off performances</li>
        <li>Analyze why a player performed well before repeating selection</li>
      </ul>
      
      <h3>5. Neglecting Bowling All-Rounders</h3>
      <p><strong>The Mistake:</strong> Always preferring batting all-rounders over bowling all-rounders.</p>
      
      <p><strong>Why It Hurts:</strong></p>
      <ul>
        <li>Bowling all-rounders often provide better value</li>
        <li>They get more opportunities to score points</li>
        <li>Lower ownership means better rank potential</li>
      </ul>
      
      <p><strong>The Solution:</strong></p>
      <ul>
        <li>Evaluate all-rounders based on their primary skill</li>
        <li>Consider match conditions and team composition</li>
        <li>Look at bowling quotas and batting positions</li>
        <li>Don't bias against players who bowl first</li>
      </ul>
      
      <h3>6. Ignoring Budget Distribution</h3>
      <p><strong>The Mistake:</strong> Spending too much on 2-3 expensive players and compromising team balance.</p>
      
      <p><strong>Why It Hurts:</strong></p>
      <ul>
        <li>Forced to pick weak players in other positions</li>
        <li>Expensive doesn't always mean better points</li>
        <li>Less flexibility for player changes</li>
      </ul>
      
      <p><strong>The Solution:</strong></p>
      <ul>
        <li>Use 60-40 budget allocation rule</li>
        <li>Identify value picks in each price range</li>
        <li>Don't spend more than 30% budget on any single player</li>
        <li>Build balanced teams across all positions</li>
      </ul>
      
      <h3>7. Not Considering Match Context</h3>
      <p><strong>The Mistake:</strong> Picking players without considering match importance, team motivation, or tournament situation.</p>
      
      <p><strong>Why It Hurts:</strong></p>
      <ul>
        <li>Teams may rest key players in dead rubbers</li>
        <li>Pressure situations affect some players differently</li>
        <li>Team combinations change based on requirements</li>
      </ul>
      
      <p><strong>The Solution:</strong></p>
      <ul>
        <li>Check if match has playoff implications</li>
        <li>Consider player track records in pressure games</li>
        <li>Analyze team's current tournament situation</li>
        <li>Look for motivated underdogs</li>
      </ul>
      
      <h3>8. Emotional Decision Making</h3>
      <p><strong>The Mistake:</strong> Letting personal team preferences or player bias influence fantasy selections.</p>
      
      <p><strong>Why It Hurts:</strong></p>
      <ul>
        <li>Emotional decisions ignore data and logic</li>
        <li>Personal favorites may not be optimal picks</li>
        <li>Bias against certain players costs opportunities</li>
      </ul>
      
      <p><strong>The Solution:</strong></p>
      <ul>
        <li>Make decisions based on data, not emotions</li>
        <li>Separate being a fan from being a fantasy manager</li>
        <li>Give every player fair consideration</li>
        <li>Focus on point-scoring potential only</li>
      </ul>
      
      <h3>9. Not Having Multiple Team Combinations</h3>
      <p><strong>The Mistake:</strong> Creating only one team and sticking with it regardless of changing conditions.</p>
      
      <p><strong>Why It Hurts:</strong></p>
      <ul>
        <li>Can't adapt to last-minute changes</li>
        <li>Miss opportunities to optimize based on new information</li>
        <li>Single team limits entry into multiple contests</li>
      </ul>
      
      <p><strong>The Solution:</strong></p>
      <ul>
        <li>Create 2-3 different team combinations</li>
        <li>Have conservative and aggressive options</li>
        <li>Keep some budget to make last-minute changes</li>
        <li>Test different captaincy options</li>
      </ul>
      
      <h3>10. Focusing Only on Star Players</h3>
      <p><strong>The Mistake:</strong> Always picking the most famous and expensive players.</p>
      
      <p><strong>Why It Hurts:</strong></p>
      <ul>
        <li>High ownership means less rank movement potential</li>
        <li>Star players often face better bowling</li>
        <li>Support players sometimes outperform stars</li>
        <li>Limits budget for balanced team building</li>
      </ul>
      
      <p><strong>The Solution:</strong></p>
      <ul>
        <li>Look for consistent mid-range performers</li>
        <li>Identify players in good form regardless of reputation</li>
        <li>Consider match-up advantages</li>
        <li>Mix stars with smart value picks</li>
      </ul>
      
      <h2>Quick Checklist to Avoid These Mistakes</h2>
      <ul>
        <li>✅ Check latest team news and playing XI</li>
        <li>✅ Choose captain based on analysis, not popularity</li>
        <li>✅ Maintain balanced team distribution (6-5 or 7-4)</li>
        <li>✅ Look at 5-10 match form, not just last game</li>
        <li>✅ Consider bowling all-rounders fairly</li>
        <li>✅ Distribute budget wisely across positions</li>
        <li>✅ Factor in match context and importance</li>
        <li>✅ Make logical, data-driven decisions</li>
        <li>✅ Create multiple team combinations</li>
        <li>✅ Mix stars with smart value picks</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Avoiding these common mistakes will immediately improve your fantasy cricket performance. Remember, success comes from consistent decision-making, thorough research, and learning from errors.</p>
      
      <p><strong>Ready to implement these lessons? Join MySeries11 and start your journey to fantasy cricket mastery!</strong></p>
    `,
    author: "Fantasy Coach",
    category: "tips",
    tags: ["fantasy mistakes", "cricket tips", "strategy guide", "common errors", "improvement"],
    featuredImage: "/images/blog/fantasy-mistakes.jpg",
    status: "published",
    metaTitle: "Top 10 Fantasy Cricket Mistakes to Avoid",
    metaDescription: "Learn the most common fantasy cricket mistakes that cost players championships. Avoid these errors and improve your fantasy game instantly.",
    views: 892,
    likes: 71,
    publishedAt: new Date('2024-03-25'),
    autoSaved: false,
    lastSaved: new Date(),
    isDraft: false,
  },
  {
    title: "Draft: Upcoming T20 World Cup Fantasy Strategies",
    excerpt: "Prepare for the T20 World Cup with early insights on team compositions, key players, and tournament-specific fantasy strategies.",
    content: `
      <h2>T20 World Cup Fantasy Preview</h2>
      <p>The T20 World Cup is approaching, and fantasy cricket enthusiasts are already planning their strategies. This draft covers early insights and preparation tips.</p>
      
      <h3>Tournament Format Impact</h3>
      <p>Understanding how the tournament structure affects player availability and team strategies...</p>
      
      <p><em>This is a draft article being worked on. More content coming soon...</em></p>
    `,
    author: "Tournament Expert",
    category: "news",
    tags: ["T20 World Cup", "tournament strategy", "draft"],
    featuredImage: "/images/blog/t20-worldcup-preview.jpg",
    status: "draft",
    metaTitle: "T20 World Cup Fantasy Strategies Preview",
    metaDescription: "Get ahead with early T20 World Cup fantasy insights and strategies. Prepare for the biggest cricket tournament.",
    views: 0,
    likes: 0,
    autoSaved: true,
    lastSaved: new Date(),
    isDraft: true,
  }
];

// Connect to MongoDB and seed blogs
const seedBlogs = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/winners11');
    console.log('Connected to MongoDB');

    // Clear existing blogs (optional - remove this line if you want to keep existing blogs)
    await Blog.deleteMany({});
    console.log('Cleared existing blogs');

    // Add slugs to sample blogs before inserting
    const blogsWithSlugs = sampleBlogs.map(blog => ({
      ...blog,
      slug: generateSlug(blog.title)
    }));

    // Insert sample blogs
    const insertedBlogs = await Blog.insertMany(blogsWithSlugs);
    console.log(`Inserted ${insertedBlogs.length} sample blogs successfully!`);

    // Display summary
    console.log('\n=== BLOG SEEDING SUMMARY ===');
    insertedBlogs.forEach(blog => {
      console.log(`✅ ${blog.title}`);
      console.log(`   Status: ${blog.status} | Category: ${blog.category} | Views: ${blog.views}`);
      console.log(`   Slug: ${blog.slug}`);
      console.log('');
    });

    console.log('=== TESTING URLS ===');
    console.log('Frontend Blog List: http://localhost:5173/blogs');
    console.log('Admin Blog Management: http://localhost:5174/manage-blogs');
    console.log('');
    insertedBlogs.slice(0, 3).forEach(blog => {
      console.log(`Blog Detail: http://localhost:5173/blog/${blog.slug}`);
    });

  } catch (error) {
    console.error('Error seeding blogs:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

// Run the seeding function
if (require.main === module) {
  seedBlogs();
}

module.exports = { seedBlogs, sampleBlogs };
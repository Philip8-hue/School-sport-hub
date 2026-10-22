from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph, Frame, Spacer
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output' / 'pdf' / 'sports-hub-user-guide.pdf'
OUT.parent.mkdir(parents=True, exist_ok=True)
GREEN = HexColor('#173e33')
INK = HexColor('#142f2b')
MUTED = HexColor('#52655b')
PAPER = HexColor('#f5f6f1')
styles = {
    'section': ParagraphStyle('section', fontName='Helvetica-Bold', fontSize=20, leading=25, textColor=GREEN, spaceAfter=12),
    'body': ParagraphStyle('body', fontName='Helvetica', fontSize=11, leading=16, textColor=INK, spaceAfter=10),
    'step': ParagraphStyle('step', fontName='Helvetica', fontSize=11, leading=16, textColor=INK, spaceAfter=9, leftIndent=13, firstLineIndent=-13),
    'note': ParagraphStyle('note', fontName='Helvetica', fontSize=10, leading=14, textColor=MUTED, spaceBefore=4, spaceAfter=12),
}
def p(text, kind='body'):
    return Paragraph(text, styles[kind])

pages = [
 [p('General overview', 'section'),
  p('Sports Hub is your guide to Anchor University sport: clubs, players, fixtures, results, league tables and campus news.'),
  p('1. <b>Explore:</b> you can view public pages without an account. Select a player to open their statistics card.', 'step'),
  p('2. <b>Create an account:</b> select <b>Sign in → Create an Account</b>. Choose Fan, Player or Coach. Enter your name, email and a password of at least 12 characters.', 'step'),
  p('3. <b>Return later:</b> select <b>Sign in</b>, choose your view and enter the same email and password. <b>My account</b> opens your dashboard.', 'step'),
  p('You can switch between Fan, Player and Coach in your dashboard. Player profiles and coaching teams need separate admin approval. The admin workspace is for approved administrators only.', 'note'),
  Spacer(1, 19), p('Fan section', 'section'),
  p('Follow the clubs and players you care about. No approval is needed.'),
  p('1. Sign in as <b>Fan</b>. Select <b>Follow</b> beside a club or player, or use the favourites form in <b>My account</b>.', 'step'),
  p('2. Select <b>Following</b> in the navigation to see your saved clubs and players. Each item links to its club page or player card.', 'step'),
  p('3. Already-followed items show a muted <b>Following</b> label. They remain clickable. Select <b>Unfollow</b> on the Following page to remove one.', 'step'),
  p('4. Back on <b>Home</b>, your following summary is still visible while signed in. Your fan dashboard shows relevant fixtures, results, published news and links to tables and fantasy sports.', 'step'),
  p('Your follows stay with your account when you return or use another device. Fans cannot see private team messages or player availability.', 'note')],
 [p('Player section', 'section'),
  p('Link your login to the player profile already listed by the university.'),
  p('1. Sign in as <b>Player</b>, then open <b>My account</b>. Use sport, club and name to find <b>your own</b> existing player profile.', 'step'),
  p('2. Explain your connection and select <b>Request admin approval</b>. Check <b>My access requests</b> for Pending, Approved, Rejected or Revoked status and the admin response.', 'step'),
  p('3. After approval, see <b>My profile</b>, sport-specific statistics, upcoming matches, results and recorded performance changes. You can edit your bio.', 'step'),
  p('4. Set your <b>Match availability</b>, read private team announcements and view proposed lineups. Use <b>Request a correction</b> if an official detail is wrong.', 'step'),
  p('You cannot change official statistics, captain status, club membership or jersey numbers yourself. A profile can belong to only one account. Contact the sports admin if your profile is already linked incorrectly.', 'note'),
  Spacer(1, 18), p('Coach section', 'section'),
  p('Request access to the teams you actually coach. Each team needs approval.'),
  p('1. Sign in as <b>Coach</b>. In <b>My account</b>, choose your team, explain your connection and select <b>Request admin approval</b>.', 'step'),
  p('2. Once approved, choose <b>My assigned team</b> to view the squad, player performance, standings, fixtures, results and player availability.', 'step'),
  p('3. Use <b>Prepare a lineup</b> to save a proposed match squad. Use <b>Team announcements</b> to send a private message to linked players and approved coaches of that team.', 'step'),
  p('4. Submit roster changes or match statistics for admin review. Check <b>My submissions &amp; admin responses</b> for the outcome. Official records change only after the admin checks and applies the update.', 'step'),
  p('One login can hold both approved player and coach links. Choosing Coach at sign-in does not make you an administrator or give access to another team.', 'note'),
  Spacer(1, 8), p('<b>Need help?</b> Ask your university sports administrator about pending requests, incorrect links or official statistics. Never share your password.', 'note')]
]
c = canvas.Canvas(str(OUT), pagesize=(595.28, 841.89))
c.setTitle('Sports Hub - A short guide for fans, players and coaches')
c.setAuthor('Anchor University Sports Hub')
for number, content in enumerate(pages, 1):
    c.setFillColor(PAPER); c.rect(0,0,595.28,841.89,fill=1,stroke=0)
    c.setFillColor(GREEN); c.rect(0,750,595.28,91,fill=1,stroke=0)
    c.setFillColor(HexColor('#ffffff')); c.setFont('Helvetica-Bold',22); c.drawString(42,794,'Sports Hub')
    c.setFont('Helvetica',11); c.drawString(42,774,'Your quick guide to getting started')
    c.linkURL('https://school-sport-hub.vercel.app/',(42,768,330,813),relative=0)
    frame = Frame(42,64,511,664,leftPadding=0,rightPadding=0,topPadding=0,bottomPadding=0)
    remaining = list(content)
    frame.addFromList(remaining,c)
    if remaining: raise RuntimeError(f'Page {number} is too long: {len(remaining)} blocks remain')
    c.setStrokeColor(HexColor('#dfe5db')); c.line(42,48,553,48)
    c.setFillColor(MUTED); c.setFont('Helvetica',9); c.drawString(42,32,'school-sport-hub.vercel.app')
    c.linkURL('https://school-sport-hub.vercel.app/',(42,28,230,43),relative=0)
    c.drawRightString(553,32,f'{number} / 2')
    c.showPage()
c.save()
print(OUT)

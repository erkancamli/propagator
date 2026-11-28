# Screenshots for the builders showcase: python3 scripts/shots.py [id ...]
# Block Arena and Optimum World are WebGL games that do not render headless; their images are frames from the makers' own launch videos on X.
import sys, io
from playwright.sync_api import sync_playwright
from PIL import Image
SITES = {
  'pitwall': 'https://optimum-pitwall.netlify.app',
  'optimumlab': 'https://optimumlab.netlify.app',
  'runner': 'https://optimumrunner.netlify.app',
  'gossipsiege': 'https://gossipsiege.xyz',
  'windtunnel': 'https://optimum-wind-tunnel.netlify.app',
  'optimumpulse': 'https://optimum-pulse.netlify.app',
  'datadash': 'https://optimum-data-dash.netlify.app',
  'optimummaker': 'https://getoptimummaker.netlify.app',
  'packetrush': 'https://optimumpacketrush.netlify.app',
  'prediction': 'https://optimumprediction.netlify.app',
  'signalorbit': 'https://optimum-signal-orbit.netlify.app',
  'turbocharging': 'https://turbocharging.vercel.app',
  'surf': 'https://optimum-surf-pixelrey.pages.dev',
  'propagationlab': 'https://propagation-lab-optimum.vercel.app',
  'noderunner': 'https://node-runner-game.netlify.app',
  'sugarsmash': 'https://optimum-smash.netlify.app',
  'signalbreach': 'https://optimum-signal.netlify.app',
  'racetheblock': 'https://optimum-race-theblock.netlify.app',
  'rlncquiz': 'https://optimum-quiz.netlify.app',
  'flappymum': 'https://flappymum.vercel.app',
  'summer': 'https://crpbase.github.io/optimum_summer/',
  'puzzle': 'https://crpbase.github.io/optimum_puzzle/',
  'memory': 'https://optimum-memory-game-pearl.vercel.app',
  'dressup': 'https://dress-up-studio.vercel.app',
  'stats': 'https://stats-optimum.vercel.app',
  'spotlightarts': 'https://spotlightarts.vercel.app',
  'hawkquiz': 'https://alekshawk.github.io/optimum-quiz/',
  'impact': 'https://validator-impact-calculator.vercel.app',
  'artgallery': 'https://optimum-archive.lovable.app',
  'identity': 'https://optimum-identity-verse.lovable.app',
  'packetrunner': 'https://optimum-packet-runner.vercel.app',
  'optimumquiz': 'https://optimum-quiz.xyz',
  'mumv': 'https://mumv.vercel.app',
  'glasses': 'https://tung2606.github.io/OptimumchangeAvt/',
  'flappyscratch': 'https://scratch.mit.edu/projects/1351989338/',
}
want = sys.argv[1:] or list(SITES)
with sync_playwright() as p:
    b = p.chromium.launch()
    for k in want:
        pg = b.new_page(viewport={'width': 1200, 'height': 750}, device_scale_factor=1)
        try:
            pg.goto(SITES[k], wait_until='networkidle', timeout=45000)
        except Exception as e:
            print('slow', k, e)
        pg.wait_for_timeout(int(__import__('os').environ.get('WAIT','3500')))
        png = pg.screenshot()
        im = Image.open(io.BytesIO(png)).convert('RGB')
        im.save(f'public/assets/shots/{k}.webp', 'WEBP', quality=82)
        im.resize((600, 375), Image.LANCZOS).save(f'public/assets/shots/{k}-600.webp', 'WEBP', quality=80)
        print('shot', k)
    b.close()

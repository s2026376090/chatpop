insert into categories (slug, name, description, icon, color)
values
  ('general-chat','General Chat','Everyday global conversations','MessageCircle','indigo'),
  ('friendship','Friendship','Meet and connect with people','Users','blue'),
  ('countries-regions','Countries & Regions','Regional and global rooms','Globe','violet'),
  ('entertainment','Entertainment','Movies, anime, music, and more','Film','pink'),
  ('technology','Technology','Programming and innovation','Cpu','cyan'),
  ('education','Education','Study and learning communities','GraduationCap','emerald'),
  ('lifestyle','Lifestyle','Travel, books, health, and hobbies','Compass','amber'),
  ('sports','Sports','Teams, games, and events','Trophy','orange'),
  ('creative-community','Creative Community','Art, design, and writing','Palette','fuchsia'),
  ('casual-fun','Casual & Fun','Relaxed and fun conversations','PartyPopper','rose')
on conflict (slug) do nothing;

insert into rooms (category_id, category_slug, slug, name, description, featured, capacity)
select c.id, c.slug, r.slug, r.name, r.description, r.featured, 250
from (
  values
    ('general-chat','general-discussion','General Discussion','Open chat for everyone', true),
    ('general-chat','meet-new-people','Meet New People','Introduce yourself and connect', true),
    ('technology','programming','Programming','Code and software engineering', true),
    ('technology','artificial-intelligence','Artificial Intelligence','AI tools, news, and ideas', true),
    ('countries-regions','global-community','Global Community','A global room for everyone', true),
    ('entertainment','gaming-chat','Gaming Chat','Gaming talk and teammates', false),
    ('education','study-together','Study Together','Stay focused with peers', false),
    ('casual-fun','late-night-chat','Late Night Chat','For late-night conversations', false)
) as r(category_slug, slug, name, description, featured)
join categories c on c.slug = r.category_slug
on conflict (slug) do nothing;

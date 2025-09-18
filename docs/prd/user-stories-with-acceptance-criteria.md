# User Stories (with Acceptance Criteria)
Legend: UT-[Epic]-[ID]
- ADM = Admin/Artist Management (Epic A)
- BKG = Booking/Client (Epic B)
- PUB = Public Website (Epic C)
- ARC = Architecture/Delivery (Epic D)

Epic A — Admin Dashboard & Artist Management
UT-ADM-01: As an admin, I can invite a new artist with a time-limited signup link.
- Given I am an admin
- When I enter the artist’s email and send an invite
- Then the artist receives a link that expires after a configured window and can register successfully

UT-ADM-02: As an artist, I can complete a wizard-style onboarding to set profile, styles, and initial portfolio.
- Given I have a valid invite
- When I follow the wizard steps (profile, styles, rates, availability)
- Then my artist profile is created and set to draft until I publish

UT-ADM-03: As an admin/owner, I can enforce 2FA for admin roles and allow optional passwordless for others.
- Given security settings are configured
- When a new admin registers
- Then they must enroll 2FA before accessing admin features

UT-ADM-04: As an editor, I can batch upload portfolio pieces with progress tracking.
- Given I have editor permissions
- When I drag-and-drop multiple images
- Then I see per-file progress and all successful uploads are linked to my portfolio

UT-ADM-05: As an editor, I can manually crop images with grid guides and save crops as separate assets.
- Given I uploaded an image
- When I open the crop tool and save
- Then a cropped asset version with metadata is created

UT-ADM-06: As an editor, I can toggle AI-assisted crop suggestions on/off at the account or workspace level.
- Given the setting is visible
- When I toggle AI suggestions off
- Then only manual cropping is suggested

UT-ADM-07: As an admin, I can manage compression settings for uploaded assets and override aggressive compression.
- Given default compression is on
- When I disable aggressive compression for a set
- Then newly processed assets use the chosen compression level

UT-ADM-08: As an admin, I can view an activity log with user, action, and timestamp to audit changes.
- Given actions were performed
- When I open the activity log
- Then I can filter by user and resource and export logs

UT-ADM-09: As an admin, I can pause an artist or globally pause the system to halt new bookings.
- Given an emergency scenario
- When I toggle pause for a specific artist or globally
- Then booking forms and availability reflect the pause with clear messaging

UT-ADM-10: As an editor, I can stage portfolio changes in a sandbox and preview before publishing live.
- Given I have draft changes
- When I open preview
- Then I see the draft state exactly as it would appear when published

Epic B — Unified Booking & Client Management
UT-BKG-01: As a visitor, I am routed to consultation vs booking based on my form inputs.
- Given I start the booking flow
- When my answers indicate uncertainty or complex needs
- Then I’m guided to a consultation request instead of direct booking

UT-BKG-02: As a visitor, I can select appointment type (first tattoo, cover-up, large piece, etc.) and see appropriate options.
- Given I’m on the booking form
- When I choose an appointment type
- Then the form adapts with relevant questions and duration estimates

UT-BKG-03: As a visitor, I can see an automated quote estimate based on size, complexity, and artist tier.
- Given I filled required fields
- When I request an estimate
- Then I see a non-binding quote and deposit requirements

UT-BKG-04: As a client, I can create an account and see my upcoming/past appointments.
- Given I signed up
- When I log in to the client portal
- Then I can view appointments and details

UT-BKG-05: As a client, I can reschedule or cancel an appointment within policy windows.
- Given I have an upcoming appointment
- When I choose reschedule/cancel within allowed times
- Then the system updates calendar and sends notifications

UT-BKG-06: As an admin, I can enable two-way Google Calendar sync per-artist.
- Given an artist connects Google Calendar
- When sync is enabled
- Then booking changes appear in their calendar and availability reflects external events

UT-BKG-07: As a client, I can pay a deposit securely and receive a receipt.
- Given a deposit is required
- When I complete checkout via supported gateway
- Then my payment intent and receipt reference are stored and visible

UT-BKG-08: As an admin, I can process a refund via the payment gateway and record it in the system.
- Given a valid refund request
- When I issue a refund
- Then the client is notified and records reflect the refund

UT-BKG-09: As an admin, I receive notifications for new bookings, cancellations, and changes.
- Given notification preferences are set
- When key events occur
- Then I receive email/SMS alerts accordingly

Epic C — Public-Facing Website Experience
UT-PUB-01: As a visitor, I experience consistent ShadCN-based UI across all pages.
- Given any site page
- When I navigate and interact
- Then spacing, typography, components, and transitions are consistent

UT-PUB-02: As a visitor, I see parallax/split-screen hero sections that are smooth and performant.
- Given I’m on the homepage or artist page
- When I scroll
- Then layered visuals and split sections animate smoothly within performance budgets

UT-PUB-03: As a visitor, I can use a dedicated search with filters (style, availability, price tier).
- Given I’m on /search
- When I apply filters
- Then artist and content results update accordingly

UT-PUB-04: As a visitor, I can use quick search (Ctrl+K) to find artists and educational content.
- Given I press Ctrl+K
- When I type a query
- Then I get navigable results for artists and key pages

UT-PUB-05: As a visitor, I can view improved aftercare content with visuals, progress tracking, and checklists.
- Given I open /aftercare
- When I read and mark steps
- Then my progress is saved locally and content is printable/PDF-downloadable

UT-PUB-06: As a visitor, I can browse artist galleries with style-based filtering and interactive zoom/lightbox.
- Given I’m on an artist page
- When I filter by style or click an image
- Then the gallery updates, and I can zoom without layout shift

Epic D — Technical Architecture & Delivery
UT-ARC-01: As a developer, I can configure Cloudflare D1/R2 and verify SSR server-side asset delivery.
- Given environment is set
- When I run the preview
- Then assets are fetched server-side and delivered via caches

UT-ARC-02: As a visitor, I benefit from progressive images and lazy loading while browsing media-heavy pages.
- Given I visit a gallery
- When images load
- Then low-res placeholders progressively upgrade without jank

UT-ARC-03: As a returning visitor, I benefit from a service worker that improves revisit speed and limited offline browsing.
- Given PWA-like capabilities
- When I revisit
- Then common assets/pages load faster and basic offline fallback is available

UT-ARC-04: As the owner, I can preview new changes on a staging environment before production.
- Given staging is deployed
- When I access the staging URL
- Then I can verify new features and content before launch

UT-ARC-05: As a maintainer, I can rely on clear docs (README, architecture, changelog) to operate and extend the system.
- Given the repository
- When a new developer onboards
- Then they can set up, run, and contribute following documented steps

-- Seeding Data
DO $$
DECLARE
    v_project_id uuid := gen_random_uuid();
BEGIN
    -- 1. Project
    INSERT INTO public.projects (id, title, slug, category, check_app_url, type, thumbnail_url)
    VALUES (
        v_project_id,
        'Master Barber Website',
        'barberweb',
        'app',
        NULL,
        'team',
        '/images/barberweb-thumbnail.jpg'
    );

    -- 2. Project Challenges
    INSERT INTO public.project_challenges (project_id, overview, timeline_days, contribution, role_summary)
    VALUES (
        v_project_id,
        'Master Barber Website is a responsive barber shop booking and admin platform that lets customers reserve appointments while giving staff a live schedule, booking management tools, and a cleaner operational view. It combines a public booking journey with a protected admin experience backed by a Go API and Supabase persistence.',
        21,
        'I designed and built the customer-facing booking flow, implemented the admin dashboard and appointment tools, wired the frontend to the Go backend, and connected live booking data to the management views.',
        'Full-Stack Developer'
    );

    -- 3. Project Problems
    INSERT INTO public.project_problems (project_id, user_needs, constraints, internal_factor, external_factor, problem_statement)
    VALUES (
        v_project_id,
        'A fast way to book a barber appointment and see what is happening on the schedule without calling or texting the shop.',
        'The interface has to work cleanly on mobile, prevent double-booking, support admin authentication, and keep the booking flow simple enough for quick reservations.',
        'The frontend, backend, and database all need to stay in sync while exposing live booking data for admin operations and analytics.',
        'Customers expect instant confirmation, clear time availability, and a premium experience that still feels practical for a barbershop workflow.',
        '“I want booking a haircut to feel effortless, and I want the staff to see the same schedule instantly without manual coordination.”'
    );

    -- 4. Project Solutions
    INSERT INTO public.project_solutions (project_id, description)
    VALUES (
        v_project_id,
        'A polished barber booking website with a responsive public reservation flow, live availability checks, Stripe checkout support, JWT-protected admin pages, and live booking-driven customer and analytics views.'
    );

    -- 5. Project Impacts
    INSERT INTO public.project_impacts (project_id, results, impact_image_url)
    VALUES (
        v_project_id,
        'Delivered a complete booking and admin system where customers can reserve appointments, staff can manage the schedule from a protected dashboard, and bookings persist through Supabase-backed storage. The frontend and backend build successfully, and the admin views now derive from live booking data instead of static fixtures.',
        NULL
    );

    -- 6. Project Contributors
    INSERT INTO public.project_contributors (project_id, name, role) VALUES
    (v_project_id, 'Solo Developer', 'Full-Stack Developer');

    -- 7. Solution Process
    INSERT INTO public.solution_process (project_id, item, order_index) VALUES
    (v_project_id, 'Requirements Definition', 1),
    (v_project_id, 'Booking Flow Design', 2),
    (v_project_id, 'Backend API Wiring', 3),
    (v_project_id, 'Admin Dashboard Integration', 4),
    (v_project_id, 'Live Data Validation', 5);

    -- 8. Solution Key Decisions
    INSERT INTO public.solution_key_decisions (project_id, item, order_index) VALUES
    (v_project_id, 'Use a dark editorial barber theme with clear booking hierarchy', 1),
    (v_project_id, 'Drive admin customer and analytics screens from live bookings', 2),
    (v_project_id, 'Keep the backend simple with JWT-protected booking endpoints and Supabase persistence', 3),
    (v_project_id, 'Use live availability checks to reduce scheduling conflicts', 4);

    -- 9. Solution Deliverables
    INSERT INTO public.solution_deliverables (project_id, item, order_index) VALUES
    (v_project_id, 'Public Landing Page', 1),
    (v_project_id, 'Booking Flow', 2),
    (v_project_id, 'Login Screen', 3),
    (v_project_id, 'Admin Dashboard', 4),
    (v_project_id, 'Appointments Board', 5),
    (v_project_id, 'Customer Management View', 6),
    (v_project_id, 'Analytics Dashboard', 7);

END $$;
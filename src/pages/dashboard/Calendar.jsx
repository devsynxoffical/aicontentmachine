import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import CalendarToolbar from "../../components/dashboard/calendar/CalendarToolbar";
import MonthView from "../../components/dashboard/calendar/MonthView";
import WeekView from "../../components/dashboard/calendar/WeekView";
import DayView from "../../components/dashboard/calendar/DayView";
import UpcomingSchedule from "../../components/dashboard/calendar/UpcomingSchedule";
import DayDetailDrawer from "../../components/dashboard/calendar/DayDetailDrawer";
import QuickScheduleModal from "../../components/dashboard/calendar/QuickScheduleModal";

import DeleteModal from "../../components/dashboard/DeleteModal";

import {
  calendarData as initialCalendarData,
} from "../../data/calendardata";

export default function Calendar() {
  const navigate = useNavigate();

  /* Views */
  const [view, setView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());

  /* Calendar State */
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/calendar");
      setEvents(data.data || []);
    } catch (err) {
      console.error("Failed to fetch calendar events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, index) => {
      const dayNum = index + 1;
      const dayEvents = events.filter((event) => {
        const eventDate = new Date(event.scheduledDate);
        return (
          eventDate.getDate() === dayNum &&
          eventDate.getMonth() === month &&
          eventDate.getFullYear() === year
        );
      });

      return {
        day: dayNum,
        events: dayEvents.map(e => ({
          ...e,
          editPath: `/dashboard/${e.type === "social-post" ? "social-posts" : e.type}?id=${e.id}`
        }))
      };
    });
  }, [events, currentDate]);

  /* Drawer */
  const [selectedDay, setSelectedDay] = useState(null);

  /* Schedule Modal */
  const [showScheduleModal, setShowScheduleModal] =
    useState(false);

  /* Delete Modal */
  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [selectedEvent, setSelectedEvent] =
    useState(null);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentMonth = `${
    months[currentDate.getMonth()]
  } ${currentDate.getFullYear()}`;

  /* Previous */

  const handlePrevious = () => {
    if (view === "month") {
      setCurrentDate(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 1,
          1
        )
      );
    } else if (view === "week") {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - 7);
      setCurrentDate(date);
    } else {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - 1);
      setCurrentDate(date);
    }
  };

  /* Next */

  const handleNext = () => {
    if (view === "month") {
      setCurrentDate(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          1
        )
      );
    } else if (view === "week") {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + 7);
      setCurrentDate(date);
    } else {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + 1);
      setCurrentDate(date);
    }
  };

  /* Edit */

  const handleEdit = (event) => {
    if (!event) return;

    navigate(event.editPath, {
      state: {
        event,
        day: selectedDay?.day,
      },
    });
  };

  /* Open Delete Modal */

  const handleDeleteClick = (event) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  /* Delete Event */

  const handleDelete = async () => {
    if (!selectedEvent || !selectedDay) return;

    try {
      await api.delete(`/calendar/${selectedEvent.id}`);
      setEvents((prev) => prev.filter((event) => event.id !== selectedEvent.id));
      setShowDeleteModal(false);
      setSelectedEvent(null);
      setSelectedDay(null);
    } catch (err) {
      console.error("Failed to unschedule event:", err);
    }
  };


  return (
    <DashboardLayout title="Content Calendar">
      {/* Header */}

      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A2E]">
            Content Calendar
          </h1>

          <p className="text-gray-500 mt-2">
            Plan, organize and schedule content across all marketing channels.
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/dashboard/create-content")
          }
          className="bg-[#02A3B1] hover:bg-[#017A85] text-white px-6 py-3 rounded-xl font-medium transition shadow-sm"
        >
          + Add Content
        </button>
      </div>

      {/* Toolbar */}

      <CalendarToolbar
        view={view}
        setView={setView}
        currentMonth={currentMonth}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />

      {/* Calendar */}

      <section className="grid xl:grid-cols-4 gap-6 mt-6">
        <div className="xl:col-span-3">
          {view === "month" && (
            <MonthView
              currentDate={currentDate}
              calendarData={calendarData}
              onDayClick={setSelectedDay}
            />
          )}

          {view === "week" && (
            <WeekView
              currentDate={currentDate}
              calendarData={calendarData}
              onDayClick={setSelectedDay}
            />
          )}

          {view === "day" && (
            <DayView
              currentDate={currentDate}
              calendarData={calendarData}
              onDayClick={setSelectedDay}
            />
          )}
        </div>

        <UpcomingSchedule />
      </section>

      {/* Day Drawer */}

      <DayDetailDrawer
        selectedDay={selectedDay}
        onClose={() => setSelectedDay(null)}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {/* Delete Modal */}

      <DeleteModal
        open={showDeleteModal}
        title="Delete Content"
        message={`Are you sure you want to delete "${
          selectedEvent?.title || "this content"
        }"? This action cannot be undone.`}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedEvent(null);
        }}
        onDelete={handleDelete}
      />

      {/* Quick Schedule Modal */}

      <QuickScheduleModal
        open={showScheduleModal}
        onClose={() =>
          setShowScheduleModal(false)
        }
      />
    </DashboardLayout>
  );
}

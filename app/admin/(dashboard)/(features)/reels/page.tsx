"use client"

import React, { useState, useEffect } from "react";
import { useReelAdmin } from "./hooks/useReelAdmin";
import { Reel } from "./api/reelApi";
import { toast } from "react-hot-toast";

// Components
import { ReelHeader } from "./components/ReelHeader";
import { ReelList } from "./components/ReelList";
import { ReelFormModal } from "./components/ReelFormModal";

const ReelsAdminPage = () => {
    const {
        reels,
        fetchReels,
        createReel,
        updateReel,
        deleteReel,
        loading,
        error,
        fieldErrors,
        successMessage,
        clearStatus,
    } = useReelAdmin();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ title: "", link: "" });

    useEffect(() => {
        fetchReels();
    }, [fetchReels]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            clearStatus();
            closeForm();
        }
    }, [successMessage]);

    useEffect(() => {
        if (error && Object.keys(fieldErrors || {}).length === 0) {
            toast.error(error);
            clearStatus();
        }
    }, [error]);

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingId(null);
        setFormData({ title: "", link: "" });
        clearStatus();
    };

    const handleEdit = (reel: Reel) => {
        setEditingId(reel._id);
        setFormData({ title: reel.title, link: reel.link });
        setIsFormOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearStatus();
        if (editingId) {
            await updateReel(editingId, formData);
        } else {
            await createReel(formData);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this reel?")) return;
        await deleteReel(id);
    };

    return (
        <div className="min-h-screen bg-white pb-12 md:pb-20 px-3 sm:px-4 md:px-0 text-black">
            <div className="max-w-[1400px] mx-auto">
                <ReelHeader onAdd={() => setIsFormOpen(true)} />

                <ReelList
                    reels={reels}
                    loading={loading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                <ReelFormModal
                    isOpen={isFormOpen}
                    onClose={closeForm}
                    onSubmit={handleSubmit}
                    editingId={editingId}
                    formData={formData}
                    setFormData={setFormData}
                    loading={loading}
                    fieldErrors={fieldErrors}
                />
            </div>
        </div>
    );
};

export default ReelsAdminPage;

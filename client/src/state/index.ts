import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// chapter or section has its own modal windows.  The bools are used to track if they are open.
// sections are arrays. These are used to track course editor states.
interface InitialStateTypes {
  courseEditor: {
    sections: Section[];
    isChapterModalOpen: boolean;
    isSectionModalOpen: boolean;
    selectedSectionIndex: number | null;
    selectedChapterIndex: number | null;
  };
}

// by default the initial states of the modal windows are not open
const initialState: InitialStateTypes = {
  courseEditor: {
    sections: [],
    isChapterModalOpen: false,
    isSectionModalOpen: false,
    selectedSectionIndex: null,
    selectedChapterIndex: null,
  },
};

// a lot of things happen in the reducer
// reducers are function that affect states.  Here its global state.
// here the payload is what will replace what was previously there.
// so we are updating that state. We pass in PayloadAction from redux toolkit, typed as section array
export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setSections: (state, action: PayloadAction<Section[]>) => {
      state.courseEditor.sections = action.payload;
    },
    // the next reducer. we set isChapterModalOpen to true, so we open the chapter.
    // when we add a specific chapter, we also set the section and chapter index.
    openChapterModal: (
      state,
      action: PayloadAction<{
        sectionIndex: number | null;
        chapterIndex: number | null;
      }>
    ) => {
      state.courseEditor.isChapterModalOpen = true;
      state.courseEditor.selectedSectionIndex = action.payload.sectionIndex;
      state.courseEditor.selectedChapterIndex = action.payload.chapterIndex;
    },
    // the opposite of the openChapterModal
    closeChapterModal: (state) => {
      state.courseEditor.isChapterModalOpen = false;
      state.courseEditor.selectedSectionIndex = null;
      state.courseEditor.selectedChapterIndex = null;
    },
    // in this case we don't worry about chapter index
    openSectionModal: (
      state,
      action: PayloadAction<{ sectionIndex: number | null }>
    ) => {
      state.courseEditor.isSectionModalOpen = true;
      state.courseEditor.selectedSectionIndex = action.payload.sectionIndex;
    },
    // opposite of openSectionModel
    closeSectionModal: (state) => {
      state.courseEditor.isSectionModalOpen = false;
      state.courseEditor.selectedSectionIndex = null;
    },
    // we pass in section and add
    addSection: (state, action: PayloadAction<Section>) => {
      state.courseEditor.sections.push(action.payload);
    },
    editSection: (
      state,
      action: PayloadAction<{ index: number; section: Section }>
    ) => {
      state.courseEditor.sections[action.payload.index] =
        action.payload.section;
    },
    deleteSection: (state, action: PayloadAction<number>) => {
      state.courseEditor.sections.splice(action.payload, 1);
    },
    // here we push the chapter into the specific section
    addChapter: (
      state,
      action: PayloadAction<{ sectionIndex: number; chapter: Chapter }>
    ) => {
      state.courseEditor.sections[action.payload.sectionIndex].chapters.push(
        action.payload.chapter
      );
    },
    // we get the section index and chapter index and replace it with new chapter
    editChapter: (
      state,
      action: PayloadAction<{
        sectionIndex: number;
        chapterIndex: number;
        chapter: Chapter;
      }>
    ) => {
      state.courseEditor.sections[action.payload.sectionIndex].chapters[
        action.payload.chapterIndex
      ] = action.payload.chapter;
    },
    deleteChapter: (
      state,
      action: PayloadAction<{ sectionIndex: number; chapterIndex: number }>
    ) => {
      state.courseEditor.sections[action.payload.sectionIndex].chapters.splice(
        action.payload.chapterIndex,
        1
      );
    },
  },
});

export const {
  setSections,
  openChapterModal,
  closeChapterModal,
  openSectionModal,
  closeSectionModal,
  addSection,
  editSection,
  deleteSection,
  addChapter,
  editChapter,
  deleteChapter,
} = globalSlice.actions;

export default globalSlice.reducer;

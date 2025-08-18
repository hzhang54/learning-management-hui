"use client";

import {
  NotificationSettingsFormData,
  notificationSettingsSchema,
} from "@/lib/schemas";
import { useUpdateUserMutation } from "@/state/api";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "./Header";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "./CustomFormField";
import { Button } from "@/components/ui/button";

// pass in an props object with title default to "Notification Settings", subtitle default to "Manage your notification settings"
// the type of the prop as SharedNotificationSettingsProps
const SharedNotificationSettings = ({
  title = "Notification Settings",
  subtitle = "Manage your notification settings",
}: SharedNotificationSettingsProps) => {
  // use useUser from clerk to get the object containing user
  const { user } = useUser();
  // grab updateUser from state/api
  // unlike in other places (like in (nondashboard)/landing page useGetCoursesQuery({}))
  // it is not destructuring,
  // here it is the first element of an array.
  const [updateUser] = useUpdateUserMutation();
  // grab currentSettings from user?.publicMetadata, cast as {settings?: UserSettings}
  // if settings member doesn't exist, set it to {} otherwise typescript will yell at us
  const currentSettings =
    (user?.publicMetadata as { settings?: UserSettings })?.settings || {};

  // user setting in ui is a chadcn forms with react hooks
  // grab methods from useForm with NotivationSettingsFormData schema that we have created. Useform is a react form hook
  // schema.ts is in client/lib/schemas.ts
  // pass in resolver: zodResolver
  const methods = useForm<NotificationSettingsFormData>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      courseNotifications: currentSettings.courseNotifications || false,
      emailAlerts: currentSettings.emailAlerts || false,
      smsAlerts: currentSettings.smsAlerts || false,
      notificationFrequency: currentSettings.notificationFrequency || "daily",
    },
  });

  // create onSubmit handler for the form
  const onSubmit = async (data: NotificationSettingsFormData) => {
    // is user doesn't exist, return
    if (!user) {
      return;
    }
    // delcare a const updatedUser that has userId, publicMetadata, with existing public data
    // and the settings consists of current settings and data which is the new info
    const updatedUser = {
      userId: user.id,
      publicMetadata: {
        ...user.publicMetadata,
        settings: {
          ...currentSettings,
          ...data,
        },
      },
    };
    // try updateuser
    try {
      await updateUser(updatedUser);
    } catch (error) {
      console.error("Failed to update user settings: ", error);
    }
  };
  if (!user) return <div>Please sign in to manage your settings.</div>;
  return (
    <div className="notification-settings">
      <Header title={title} subtitle={subtitle} />
      {/* Now we create form.  We are using form from react-hook form
    but, shadcn's version of react hook form, pass in the method we created
    and a form with onSumbit handler, classname of 
    notification-settings__form
    */}
      <Form {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="notification-settings__form"
        >
          {/* in components/CustomFormField.tsx we have premade form fields for chadcn
create a div with className ending with field 
this custom form field is already connect to our use form
*/}
          <div className="notification-settings__fields">
            <CustomFormField
              name="courseNotifications"
              label="Course Notifications"
              type="switch"
            />

            <CustomFormField
              name="emailAlerts"
              label="Email Alerts"
              type="switch"
            />

            <CustomFormField
              name="smsAlerts"
              label="SMS Alerts"
              type="switch"
            />

            <CustomFormField
              name="notificationFrequency"
              label="Notification Freuqency"
              type="select"
              options={[
                { value: "immediate", label: "Immediate" },
                { value: "daily", label: "Daily" },
                { value: "weekly", label: "Weekly" },
              ]}
            />
          </div>
          <Button type="submit" className="notification-settings__submit">
            Update Settings
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SharedNotificationSettings;

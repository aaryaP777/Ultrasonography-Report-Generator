import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import "../App.css";

const ReportPage = () => {
  const { organ } = useParams(); // Retrieve organ from the URL

  // Form data state
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    patientGender: "",
    date: "",
    size: "",
    echoReflectivity: "",
    sizeRemark: "",
    lesion: "",
    subsec1: "",
    subsec2: "",
    subsec3: "",
    subsec4: "",
    subsec5: "",
    lesionDetailsText: "",
    vascularityRegion: "",
    doctorName: "",
    doctorDesignation: "",
  });

  // Dropdown selections state
  const [sizeRemark, setsizeRemark] = useState("");
  const [echoReflectivity, setEchoReflectivity] = useState("");
  const [lesion, setLesion] = useState("");
  const [form, setForm] = useState("");
  const [presentSelected, setPresentSelected] = useState(false);

  // Final impressions based on dropdown values
  const generateImpression = () => {};

  const generateOrganFindings = (
    size,
    sizeRemark,
    echoReflectivity,
    lesion,
    subsec1,
    subsec2,
    subsec3,
    subsec4,
    subsec5,
    lesionDetailsText,
    vascularityRegion
  ) => {
    if (sizeRemark && echoReflectivity && size) {
      let findingsPrint = `${sizeRemark.toLowerCase()} in size (${size} cm) and has ${echoReflectivity.toLowerCase()} echo-reflectivity.`;

      if (lesion === "present") {
        // findingsPrint += " A lesion is present.";
        if (subsec1 && subsec2 && subsec3 && subsec4 && lesionDetailsText) {
          findingsPrint += ` A ${subsec1.toLowerCase()} ${subsec2.toLowerCase()} lesion is noted in ${subsec3} of ${subsec4.toLowerCase()} measuring ${lesionDetailsText} mm. `;
          if (subsec5 === "Present" && vascularityRegion) {
            findingsPrint += `Vascularity is present in ${vascularityRegion.toLowerCase()} region.`;
          } else if (subsec5 === "Absent") {
            findingsPrint += "Vascularity is absent.";
          }
        } else {
          findingsPrint +=
            " Focal lesion is present but detailed subsection information is missing.";
        }
      } else if (lesion === "absent") {
        findingsPrint += " No focal lesions seen.";
      }
      return findingsPrint;
    } else {
      return "No findings";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // for Lesion options
  const handleLesionChange = (e) => {
    const value = e.target.value;
    setLesion(value);
    if (value === "present") {
      setForm({
        ...form,
        lesionDetails: {
          subsections: [
            {
              label: "Lesion Definition - 1",
              name: "subsec1",
              type: "dropdown",
              options: ["Select", "Well-circumcised", "Ill-defined"],
            },
            {
              label: "Lesion Definition - 2",
              name: "subsec2",
              type: "dropdown",
              options: [
                "Select",
                "Hyperechoic",
                "Hypoechoic",
                "Anechoic",
                "Other",
              ],
            },
            {
              label: "Location",
              name: "subsec3",
              type: "dropdown",
              options: [
                "Select Segment type",
                "Segment I",
                "Segment II",
                "Segment III",
                "Segment IVa",
                "Segment IVb",
                "Segment V",
                "Segment VI",
                "Segment VII",
                "Segment VIII",
              ],
            },
            {
              label: "Lobe",
              name: "subsec4",
              type: "dropdown",
              options: [
                "Select Lobe Type",
                "Right lobe",
                "Left lobe",
                "Caudate lobe",
              ],
            },
          ],
          textBox: {
            label: "Size of lesion (mm)",
            name: "lesionDetailsText",
            type: "number",
          },
          subsections2: [
            {
              label: "Vascularity",
              name: "subsec5",
              type: "dropdown",
              options: ["Select", "Present", "Absent"],
            },
          ],
        },
      });

      // Initialize lesion-related fields in formData
      setFormData((prev) => ({
        ...prev,
        subsec1: "",
        subsec2: "",
        subsec3: "",
        subsec4: "",
        subsec5: "",
        lesionDetailsText: "",
      }));
    } else {
      setForm({
        ...form,
        lesionDetails: null,
      });

      // Clear lesion-related fields in formData
      setFormData((prev) => ({
        ...prev,
        subsec1: "",
        subsec2: "",
        subsec3: "",
        subsec4: "",
        subsec5: "",
        lesionDetailsText: "",
      }));
    }
  };

  const handleVascularityChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      subsec5: value,
      vascularityRegion: value === "Present" ? "" : null,
    }));

    if (value === "Present") {
      setPresentSelected(true);
    } else {
      setPresentSelected(false);
    }
  };

  // Format for generated Word Document.
  const generateWord = () => {
    const {
      size,
      subsec1,
      subsec2,
      subsec3,
      subsec4,
      subsec5,
      lesionDetailsText,
      vascularityRegion,
    } = formData;
    const impression = generateImpression();
    const Organfindings = generateOrganFindings(
      size,
      sizeRemark,
      echoReflectivity,
      lesion,
      subsec1,
      subsec2,
      subsec3,
      subsec4,
      subsec5,
      lesionDetailsText,
      vascularityRegion
    );

    const formatDate = (dateString) => {
      const [year, month, day] = dateString.split("-");
      return `${day}/${month}/${year}`;
    };

    const formattedDate = formData.date ? formatDate(formData.date) : "";

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `Patient Name: ${formData.patientName}                                                 Date: ${formattedDate}`,
                  size: 30,
                }),
              ],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Age/Gender: ${formData.age} years / ${formData.patientGender}`,
                  size: 30,
                }),
              ],
              spacing: { after: 300 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `ULTRASONOGRAPHY OF ${organ}`,
                  underline: true,
                  size: 32,
                  font: "Times New Roman",
                }),
              ],
              alignment: "center", // Center-aligned text
              spacing: { after: 300 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Findings:",
                  bold: true,
                  underline: true,
                  size: 30,
                }),
              ],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `${organ}: `, size: 30, bold: true }),
                new TextRun({ text: Organfindings, size: 30 }),
              ],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Impression:",
                  bold: true,
                  size: 30,
                  underline: true,
                }),
              ],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [new TextRun({ text: impression, size: 30 })],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `${formData.doctorName}`, size: 30 }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${formData.doctorDesignation}`,
                  size: 30,
                }),
              ],
              spacing: { after: 200 },
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `Sonography_Report_${organ}.docx`);
    });
  };

  // UI for the user
  return (
    <div style={{ padding: "20px" }} className="bg-blue-100 min-h-screen">
      <h1>
        <center>Sonography Report of {organ}</center>
      </h1>
      <br />
      <form>
        <div>
          <label>Patient Name:</label>

          <input
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Patient Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Patient Gender:</label>
          <select
            name="patientGender"
            value={formData.patientGender}
            onChange={handleInputChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Size (cm):</label>
          <input
            type="number"
            name="size"
            value={formData.size}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, size: e.target.value }))
            }
          />
        </div>
        <div>
          <label>Remark for size:</label>
          <select
            value={sizeRemark}
            onChange={(e) => setsizeRemark(e.target.value)}
          >
            <option value="">Select Remark</option>
            <option value="Normal">Normal</option>
            <option value="Enlarged">Enlarged</option>
            <option value="Reduced">Reduced</option>
          </select>
        </div>
        <div>
          <label>Echo-Reflectivity:</label>
          <select
            value={echoReflectivity}
            onChange={(e) => setEchoReflectivity(e.target.value)}
          >
            <option value="">Select Echo-Reflectivity</option>
            <option value="Normal">Normal</option>
            <option value="Increased">Increased</option>
            <option value="Decreased">Decreased</option>
          </select>
        </div>
        <div>
          <label>Lesion:</label>
          <select value={lesion} onChange={handleLesionChange}>
            <option value="">Select Lesion</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
          </select>

          {form.lesionDetails && (
            <div>
              {form.lesionDetails.subsections.map(
                (
                  sub,
                  index //first subsection and changes inside it.
                ) => (
                  <div key={index}>
                    <label>{sub.label || "Select"}:</label>
                    <select
                      name={sub.name}
                      value={formData[sub.name]} // Bind to formData
                      onChange={handleInputChange} // Update formData on change
                    >
                      {sub.options.map((option, idx) => (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                )
              )}

              <div>
                <label>{form.lesionDetails.textBox.label}:</label>
                <input
                  type="text"
                  name={form.lesionDetails.textBox.name}
                  value={formData[form.lesionDetails.textBox.name]} // Bind to formData
                  onChange={handleInputChange} // Update formData on change
                />
              </div>

              {form.lesionDetails.subsections2.map(
                (
                  sub,
                  index // second subsection and changes inside it.
                ) => (
                  <div key={index}>
                    <label>{sub.label || "Vascularity"}:</label>
                    <select
                      name={sub.name}
                      value={formData[sub.name]}
                      onChange={
                        sub.name === "subsec5" ? handleVascularityChange : null
                      }
                    >
                      {sub.options.map((option, idx) => (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {sub.name === "subsec5" && presentSelected && (
                      <div>
                        <label>Vascularity Region:</label>
                        <select
                          name="vascularityRegion"
                          value={formData.vascularityRegion || ""}
                          onChange={handleInputChange}
                        >
                          <option value="">Select region</option>
                          <option value="Central">Central</option>
                          <option value="Peripheral">Peripheral</option>
                          <option value="Both">Both</option>
                        </select>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </div>
        <div>
          <label>Doctor Name:</label>
          <input
            type="text"
            name="doctorName"
            value={formData.doctorName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Doctor Designation:</label>
          <input
            type="text"
            name="doctorDesignation"
            value={formData.doctorDesignation}
            onChange={handleInputChange}
          />
        </div>
        <button className="wordDoc" type="button" onClick={generateWord}>
          Generate Word Document
        </button>
      </form>
    </div>
  );
};

export default ReportPage;

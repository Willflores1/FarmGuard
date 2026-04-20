import streamlit as st
import requests

BASE_URL = "https://farmguard-api-451992629539.us-central1.run.app"


st.set_page_config(page_title="FarmGuard UI", layout="wide")

st.title("FarmGuard UI")

tab_snap, tab_logs = st.tabs(["SoilSnap", "Logs"])

with tab_snap:
    st.header("SoilSnap")
    st.caption("Upload a soil image + field tag + notes, then submit.")

    image = st.file_uploader("Soil image", type=["jpg", "jpeg", "png"])
    field_tag = st.text_input("Field tag", placeholder="e.g., Plot A")
    notes = st.text_area("Notes", placeholder="Optional notes...")

    submit = st.button("Submit")

if submit:
    if image is None:
        st.error("Please upload an image first.")
    elif field_tag.strip() == "":
        st.error("Please enter a field tag (e.g., Plot A).")
    else:
        try:
            files = {
                "image": (image.name, image.getvalue(), image.type)
            }
            data = {
                "field_tag": field_tag,
                "notes": notes
            }

            resp = requests.post(
                f"{BASE_URL}/soil-snap",
                files=files,
                data=data,
                timeout=60
            )

            if resp.status_code == 200:
                result = resp.json()
                log = result.get("log", {})
                pred = log.get("prediction", {})
                conf = pred.get("confidence", {})

                st.subheader("Results")
                st.write("Field tag:", log.get("field_tag"))
                st.write("Notes:", log.get("notes"))
                st.write("Timestamp:", log.get("timestamp"))

                st.write("Texture:", pred.get("texture_proxy"))
                st.write("Moisture:", pred.get("moisture"))
                st.write("Degradation:", pred.get("degradation"))

                if pred.get("is_uncertain"):
                    st.warning("Uncertain Result")
                else:
                    st.success("Confident Result")

                st.caption(
                    f"Confidence - Texture: {conf.get('texture_proxy')} | "
                    f"Moisture: {conf.get('moisture')} | "
                    f"Degradation: {conf.get('degradation')}"
                )

            else:
                st.error(f"Backend error: {resp.status_code}")
                st.code(resp.text)

        except Exception as e:
            st.error(f"Request failed: {e}")




with tab_logs:
    st.header("Logs")
    st.caption("Recent soil scan entries")

    if st.button("Refresh Logs"):
        try:
            response = requests.get(f"{BASE_URL}/logs?limit=25")
            
            if response.status_code == 200:
                data = response.json()
                logs = data.get("logs", [])

                if logs:
                    for log in logs:
                        with st.expander(f"{log.get('field_tag', 'Unknown')} - {log.get('timestamp')}"):
                            st.write("Notes:", log.get("notes"))

                            prediction = log.get("prediction", {})
                            
                            st.write("Texture:", prediction.get("texture_proxy"))
                            st.write("Moisture:", prediction.get("moisture"))
                            st.write("Degradation:", prediction.get("degradation"))

                            if prediction.get("is_uncertain"):
                                st.warning("Uncertain Result")
                            else:
                                st.success("Confident Result")

                            confidence = prediction.get("confidence", {})
                            st.caption(f"Confidence - Texture: {confidence.get('texture_proxy')} | Moisture: {confidence.get('moisture')} | Degradation: {confidence.get('degradation')}")
                else:
                    st.info("No logs found.")

            else:
                st.error(f"Error fetching logs: {response.status_code}")

        except Exception as e:
            st.error(f"Connection error: {e}")


<script>
  import { site } from "../../../stores";
  let formData = {};
  const handleFormSubmit = async e => {
    e.preventDefault();
    
  };
</script>

<p>{JSON.stringify($site)}</p>
<div class="BoxInsetLg">
  <p>{JSON.stringify(formData)}</p>
  <form on:submit={handleFormSubmit} action="#">
    <label for="id">File name</label>
    <input name="id" type="text" bind:value={formData.id} />
    <label for="content">content</label>
    <input name="content" type="text" bind:value={formData.content} />
    <button type="submit">Submit</button>
  </form>
  <a href="site/{$site.id}/edit">Edit</a>
</div>
